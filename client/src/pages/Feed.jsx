import { useEffect, useState } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import PostCard from "../components/PostCard";
import PollCard from "../components/PollCard";

const Feed = () => {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFeed = async () => {
    try {
      // Make sure this URL matches your backend
      const { data } = await axios.get("https://devsphere-gz00.onrender.com/api/content/feed");
      setFeed(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load feed.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="mt-4">{error}</Alert>;

  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      {feed.map((item) => (
        item.type === 'poll' ? (
          <PollCard key={item._id} poll={item} refreshFeed={fetchFeed} />
        ) : (
          <PostCard key={item._id} post={item} refreshFeed={fetchFeed} />
        )
      ))}
      {feed.length === 0 && <p className="text-center text-muted">No posts yet. Be the first!</p>}
    </Container>
  );
};

export default Feed;