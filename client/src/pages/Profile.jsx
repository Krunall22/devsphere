import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import PollCard from "../components/PollCard"; // Reusing your card component

const Profile = () => {
  const { id } = useParams(); // ID from URL
  const [profile, setProfile] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Follow State
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get User Details
        const { data: user } = await axios.get(`https://devsphere-gz00.onrender.com/api/auth/${id}`);
        setProfile(user);
        setFollowersCount(user.followers.length);
        
        // 2. Check if I am already following them
        if (user.followers.includes(userInfo._id)) {
          setIsFollowing(true);
        }

        // 3. Get User's Posts
        const { data: posts } = await axios.get(`https://devsphere-gz00.onrender.com/api/content/user/${id}`, config);
        setContent(posts);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data");
        setLoading(false);
      }
    };
    fetchData();
  }, [id, userInfo._id]); // Run when ID changes

  // --- HANDLE FOLLOW CLICK ---
  const handleFollow = async () => {
    try {
      await axios.put(`https://devsphere-gz00.onrender.com/api/auth/follow/${id}`, {}, config);
      
      // Update UI instantly (Optimistic UI)
      if (isFollowing) {
        setFollowersCount(prev => prev - 1);
        setIsFollowing(false);
      } else {
        setFollowersCount(prev => prev + 1);
        setIsFollowing(true);
      }
    } catch (error) {
      alert("Something went wrong");
    }
  };

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <Container className="mt-5">
      {/* 🟢 PROFILE HEADER */}
      <Card className="p-4 mb-4 shadow-sm border-0">
        <Row className="align-items-center">
          <Col md={3} className="text-center">
            {/* Avatar */}
            <div 
              className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center mx-auto mb-3" 
              style={{ width: "100px", height: "100px", fontSize: "2.5rem" }}
            >
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
          </Col>
          <Col md={9} className="text-center text-md-start">
            <h3>{profile?.name}</h3>
            <p className="text-muted">{profile?.email}</p>
            
            {/* 📊 STATS */}
            <div className="d-flex gap-4 justify-content-center justify-content-md-start mb-3">
               <div><strong>{content.length}</strong> Posts</div>
               <div><strong>{followersCount}</strong> Followers</div>
               <div><strong>{profile?.following?.length || 0}</strong> Following</div>
            </div>
            
            {/* 🔘 ACTION BUTTONS */}
            {userInfo._id === profile?._id ? (
              <Button variant="outline-dark" size="sm">⚙️ Edit Profile</Button>
            ) : (
              <Button 
                variant={isFollowing ? "outline-secondary" : "primary"} 
                size="sm" 
                onClick={handleFollow}
                style={{ width: "120px" }}
              >
                {isFollowing ? "Unfollow" : "Follow"}
              </Button>
            )}
          </Col>
        </Row>
      </Card>

      {/* 🟢 POSTS GRID */}
      <h4 className="mb-3">Posts</h4>
      <Row>
        {content.length > 0 ? (
          content.map((item) => (
            <Col md={6} lg={4} key={item._id} className="mb-4">
               <PollCard poll={item} refreshFeed={() => {}} />
            </Col>
          ))
        ) : (
          <p className="text-muted text-center">No posts yet.</p>
        )}
      </Row>
    </Container>
  );
};

export default Profile;