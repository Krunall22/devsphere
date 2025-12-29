import { useEffect, useState } from "react";
import { Container, Card, Image, Tabs, Tab, Spinner, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ArrowLeft, Edit2 } from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";
import PostCard from "../components/PostCard";
import PollCard from "../components/PollCard";
import EditProfileModal from "../components/EditProfileModal"; // <--- New Component
import moment from "moment";

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("userInfo")));
  const [posts, setPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    if (!user) return;
    try {
      const token = user.token;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 1. Get Fresh User Data (To get accurate bookmarks list)
      const { data: userData } = await axios.get("http://localhost:5000/api/auth/profile", config);
      setUser({ ...userData, token }); // Keep token

      // 2. Get All Posts
      const { data: allFeed } = await axios.get("http://localhost:5000/api/content/feed");

      // 3. Filter My Posts
      const myPosts = allFeed.filter(p => p.user?._id === userData._id);
      setPosts(myPosts);

      // 4. Filter Bookmarked Posts (Compare IDs)
      const saved = allFeed.filter(p => userData.bookmarks.includes(p._id));
      setBookmarkedPosts(saved);

      setLoading(false);
    } catch (error) { 
      console.error(error); 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (!user) return <div className="text-center mt-5">Please Login</div>;

  return (
    <>
      <Navbar />
      <Container className="d-flex flex-column align-items-center">
        
        {/* Back Button */}
        <div style={{ width: "100%", maxWidth: "600px" }} className="mb-3">
          <Button as={Link} to="/" variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2" style={{ width: "fit-content" }}>
            <ArrowLeft size={18} /> Back to Feed
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="text-center p-4 shadow-sm mb-4 border-0 position-relative" style={{ width: "100%", maxWidth: "600px", borderRadius: "15px" }}>
          
          {/* Edit Button */}
          <Button 
            variant="light" 
            size="sm" 
            className="position-absolute top-0 end-0 m-3 rounded-circle shadow-sm"
            onClick={() => setShowEdit(true)}
          >
            <Edit2 size={18} />
          </Button>

          <Card.Body>
             <Image 
               src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}`} 
               roundedCircle 
               width={100} 
               height={100} 
               className="mb-3 shadow-sm" 
               style={{objectFit: 'cover'}}
             />
             <h3 className="fw-bold">{user.name}</h3>
             <p className="text-muted mb-1">{user.email}</p>
             <small className="text-muted">Joined: {moment(user.joinedDate).format("MMMM Do YYYY")}</small>
          </Card.Body>
        </Card>

        {/* Tabs */}
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <Tabs defaultActiveKey="posts" className="mb-3 justify-content-center border-bottom-0">
            
            {/* My Posts Tab */}
            <Tab eventKey="posts" title={`My Posts (${posts.length})`}>
              {loading ? <Spinner animation="border" /> : posts.map(p => (
                 p.type === 'post' 
                 ? <PostCard key={p._id} post={p} refreshFeed={fetchData} /> 
                 : <PollCard key={p._id} poll={p} refreshFeed={fetchData} />
              ))}
              {posts.length === 0 && !loading && <p className="text-center text-muted">No posts yet.</p>}
            </Tab>

            {/* Bookmarks Tab - NOW WORKING */}
            <Tab eventKey="saved" title={`Bookmarks (${bookmarkedPosts.length})`}>
               {loading ? <Spinner animation="border" /> : bookmarkedPosts.map(p => (
                  <PostCard key={p._id} post={p} refreshFeed={fetchData} />
               ))}
               {bookmarkedPosts.length === 0 && !loading && <p className="text-center text-muted">No bookmarks yet.</p>}
            </Tab>

          </Tabs>
        </div>
      </Container>

      {/* Edit Modal */}
      <EditProfileModal 
        show={showEdit} 
        handleClose={() => setShowEdit(false)} 
        user={user} 
        refreshUser={fetchData} 
      />
    </>
  );
};

export default Profile;