import { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) return setError("Please login to post");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Send post to your live Render backend
      await axios.post(
        "https://devsphere-gz00.onrender.com/api/content",
        { title, description, image, tags, type: "post" },
        config
      );

      navigate("/"); // Go back to feed after posting
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <Card className="p-4 shadow-sm border-0">
        <h2 className="text-center mb-4">📸 Create New Post</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="What's on your mind?" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={3} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Paste image link here" 
              value={image} 
              onChange={(e) => setImage(e.target.value)} 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tags (comma separated)</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="coding, tech, dev" 
              value={tags} 
              onChange={(e) => setTags(e.target.value)} 
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 fw-bold">
            Post to DevSphere
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default CreatePost;