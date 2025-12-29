import { useState } from "react";
import { Modal, Button, Form, Image, Alert } from "react-bootstrap";
import axios from "axios";
import { Camera } from "lucide-react";

const EditProfileModal = ({ show, handleClose, user, refreshUser }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [pic, setPic] = useState(user.profilePic || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")).token;
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const { data } = await axios.put("https://devsphere-gz00.onrender.com/api/auth/profile", {
        name, email, profilePic: pic, password
      }, config);

      localStorage.setItem("userInfo", JSON.stringify(data)); // Update LocalStorage
      refreshUser(); // Update UI
      handleClose();
      setLoading(false);
    } catch (err) {
      setError("Update failed");
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton><Modal.Title>Edit Profile</Modal.Title></Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          
          {/* Profile Pic Upload */}
          <div className="text-center mb-3">
            <div className="position-relative d-inline-block">
              <Image src={pic || `https://ui-avatars.com/api/?name=${name}`} roundedCircle width={100} height={100} style={{objectFit:"cover"}} />
              <label className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1" style={{cursor:"pointer"}}>
                <Camera size={16} />
                <input type="file" hidden onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          <Form.Group className="mb-3"><Form.Label>Full Name</Form.Label><Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Form.Group>
          <Form.Group className="mb-3"><Form.Label>New Password (Optional)</Form.Label><Form.Control type="password" placeholder="Leave blank to keep same" value={password} onChange={(e) => setPassword(e.target.value)} /></Form.Group>

          <Button variant="primary" type="submit" disabled={loading} className="w-100">{loading ? "Updating..." : "Save Changes"}</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;