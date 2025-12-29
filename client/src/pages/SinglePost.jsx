import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Spinner, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import PostCard from "../components/PostCard";
import PollCard from "../components/PollCard";

const SinglePost = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(`https://devsphere-gz00.onrender.com/api/content/view/${id}`);
        setContent(data);
        setLoading(false);
      } catch (err) {
        setError("Post not found or deleted.");
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  return (
    <>
      <Navbar />
      <Container className="d-flex flex-column align-items-center">
        
        {/* Back Button */}
        <div style={{ width: "100%", maxWidth: "600px" }} className="mb-3">
          <Button as={Link} to="/" variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2">
            <ArrowLeft size={18} /> Back to Feed
          </Button>
        </div>

        <div style={{ width: "100%", maxWidth: "600px" }}>
          {loading ? (
            <div className="text-center mt-5"><Spinner animation="border" /></div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            content.type === 'post' 
              ? <PostCard post={content} refreshFeed={() => {}} /> 
              : <PollCard poll={content} refreshFeed={() => {}} />
          )}
        </div>
      </Container>
    </>
  );
};

export default SinglePost;