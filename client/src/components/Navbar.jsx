import { useContext } from "react";
import { Navbar, Container, Button, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // <--- Import useNavigate
import AuthContext from "../context/AuthContext";

const Navigation = ({ onShowCreate }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // <--- Initialize hook

  const handleLogout = () => {
    logout();           // 1. Clear user data
    navigate("/login"); // 2. Force redirect to Login page
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm" style={{ backgroundColor: "#1a1a1a" }}>
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          DevSphere 🌍
        </Navbar.Brand>

        {/* Mobile Toggle Button */}
        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-2">
            {user ? (
              <>
                {/* Create New Post/Poll */}
                <Button variant="success" onClick={onShowCreate} className="fw-bold">
                  + Create
                </Button>

                {/* Profile Link */}
                <Button as={Link} to="/profile" variant="outline-light">
                  Profile
                </Button>

                {/* Logout - NOW REDIRECTS */}
                <Button variant="outline-secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="primary" className="me-2">
                  Login
                </Button>
                <Button as={Link} to="/register" variant="outline-light">
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;