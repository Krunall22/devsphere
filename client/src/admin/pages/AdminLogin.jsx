import { useState } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Login Request
      const { data } = await axios.post("https://devsphere-gz00.onrender.com/api/auth/login", { email, password });

      // 2. Security Check
      if (data.role !== "admin") {
        setError("⛔ You are not an Admin!");
        return;
      }

      // 3. Success
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid Credentials");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center bg-dark" style={{ height: "100vh", maxWidth: "100%" }}>
      <Card className="p-4 shadow-lg" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">🛡️ Admin Portal</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>
          <Button variant="dark" type="submit" className="w-100">Enter System</Button>
        </Form>
      </Card>
    </Container>
  );
};

export default AdminLogin;