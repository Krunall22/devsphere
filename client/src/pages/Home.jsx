import { useEffect, useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import axios from "axios";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import PollCard from "../components/PollCard";
import CreateModal from "../components/CreateModal"; // We will make this next

const Home = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchFeed = async () => {
    try {
      const { data } = await axios.get("https://devsphere-gz00.onrender.com/api/content/feed");
      setFeed(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feed", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <>
      <Navbar onShowCreate={() => setShowModal(true)} />
      
      <Container style={{ maxWidth: "800px" }}>
        {loading ? (
          <div className="text-center mt-5"><Spinner animation="border" /></div>
        ) : (
          feed.map((item) => (
            item.type === 'post' 
              ? <PostCard key={item._id} post={item} refreshFeed={fetchFeed} /> 
              : <PollCard key={item._id} poll={item} refreshFeed={fetchFeed} />
          ))
        )}
      </Container>

      {/* Pop-up Modal to Create Post/Poll */}
      <CreateModal show={showModal} handleClose={() => setShowModal(false)} refreshFeed={fetchFeed} />
    </>
  );
};

export default Home;