import { useState } from "react";
import { Modal, Button, Form, Tabs, Tab, Alert, Image } from "react-bootstrap";
import axios from "axios";
import { Image as ImageIcon, X } from "lucide-react"; // Icon

const CreateModal = ({ show, handleClose, refreshFeed }) => {
  const [key, setKey] = useState("post");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Post Data
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState(""); // <--- Stores the image data

  // Poll Data
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  // Handle File Upload (Convert to Base64)
 const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
    
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // This converts image to string
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => setImage("");

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => setOptions([...options, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (key === "post") {
        await axios.post(
          "https://devsphere-gz00.onrender.com/api/content/posts", 
          { title, description: desc, tags, image }, // <--- Sending Image
          config
        );
      } else {
        const cleanOptions = options.filter((opt) => opt.trim() !== "");
        if (cleanOptions.length < 2) throw new Error("Poll needs at least 2 options");
        await axios.post("https://devsphere-gz00.onrender.com/api/content/polls", { question, options: cleanOptions }, config);
      }

      setLoading(false);
      handleClose();
      refreshFeed();
      
      // Reset
      setTitle(""); setDesc(""); setTags(""); setImage("");
      setQuestion(""); setOptions(["", ""]);

    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton><Modal.Title>Create New Content</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
          
          {/* POST TAB */}
          <Tab eventKey="post" title="📝 Post">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} placeholder="What's on your mind?" value={desc} onChange={(e) => setDesc(e.target.value)} required />
              </Form.Group>

              {/* IMAGE UPLOAD SECTION */}
              <Form.Group className="mb-3">
                <Form.Label className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2" style={{cursor: 'pointer'}}>
                   <ImageIcon size={18} /> {image ? "Change Image" : "Add Image"}
                   <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
                </Form.Label>
                
                {/* Image Preview */}
                {image && (
                  <div className="position-relative mt-2">
                    <Image src={image} fluid rounded style={{maxHeight: '200px', width: '100%', objectFit: 'cover'}} />
                    <Button 
                      variant="danger" 
                      size="sm" 
                      className="position-absolute top-0 end-0 m-1 rounded-circle p-1" 
                      onClick={removeImage}
                      style={{width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Tags</Form.Label>
                <Form.Control type="text" placeholder="react, js" value={tags} onChange={(e) => setTags(e.target.value)} />
              </Form.Group>
              
              <Button variant="primary" type="submit" disabled={loading} className="w-100">
                {loading ? "Posting..." : "Post Now"}
              </Button>
            </Form>
          </Tab>

          {/* POLL TAB */}
          <Tab eventKey="poll" title="📊 Poll">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Question</Form.Label>
                <Form.Control type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />
              </Form.Group>
              <Form.Label>Options</Form.Label>
              {options.map((opt, index) => (
                <Form.Control key={index} type="text" placeholder={`Option ${index + 1}`} value={opt} onChange={(e) => handleOptionChange(index, e.target.value)} className="mb-2" required />
              ))}
              <Button variant="outline-secondary" size="sm" onClick={addOption} className="mb-3 w-100">+ Add Option</Button>
              <Button variant="success" type="submit" disabled={loading} className="w-100">{loading ? "Creating..." : "Create Poll"}</Button>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default CreateModal;