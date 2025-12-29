import { useState, useContext } from "react";
import { Container, Form, Button, Card, Alert, Image } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react"; // Icon
import axios from "axios"; // Direct axios for custom request
import AuthContext from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState(""); // <--- Store Image
  const [error, setError] = useState("");
  const { register } = useContext(AuthContext); // We will update this context too
  const navigate = useNavigate();

  // Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2000000) return setError("Image too large (Max 2MB)");
      const reader = new FileReader();
      reader.onloadend = () => {
        setPic(reader.result);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Custom Register Logic to include Pic
    try {
      const { data } = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        profilePic: pic // <--- Send Pic
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      window.location.href = "/"; // Force reload to apply auth
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <Card style={{ width: "400px" }} className="p-4 shadow">
        <h2 className="text-center mb-4">Sign Up</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          
          {/* Profile Pic Upload */}
          <div className="text-center mb-3">
            <div className="position-relative d-inline-block">
              <Image 
                src={pic || `https://ui-avatars.com/api/?name=${name || "User"}`} 
                roundedCircle 
                width={80} 
                height={80} 
                style={{objectFit: "cover"}}
                className="shadow-sm"
              />
              <label className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-1 shadow" style={{cursor: "pointer"}}>
                <Camera size={14} />
                <input type="file" hidden onChange={handleImageUpload} accept="image/*" />
              </label>
            </div>
            <Form.Text className="d-block text-muted">Upload Profile Picture (Optional)</Form.Text>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email Address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">Sign Up</Button>
        </Form>
        <div className="text-center mt-3">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </Card>
    </Container>
  );
};

export default Register;