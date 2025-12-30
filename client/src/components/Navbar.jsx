import { useContext, useState } from "react";
import { Navbar, Container, Button, Nav, Form, FormControl, ListGroup, Badge } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const Navigation = ({ onShowCreate }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // 🔍 State for Search
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // 🔍 Handle Search Typing
  const handleSearch = async (e) => {
    const searchText = e.target.value;
    setQuery(searchText);

    if (searchText.length > 1) {
      try {
        const { data } = await axios.get(`https://devsphere-gz00.onrender.com/api/auth/search?q=${searchText}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setSearchResults(data);
      } catch (error) {
        console.error("Search failed");
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm" sticky="top" style={{ backgroundColor: "#1a1a1a" }}>
      <Container>
        {/* Brand Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          DevSphere 🌍
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav">
          
          {/* 🔍 SEARCH BAR (Centered) */}
          <div className="mx-auto position-relative mt-2 mt-lg-0" style={{ width: "100%", maxWidth: "400px" }}>
            <Form className="d-flex">
              <FormControl
                type="search"
                placeholder="Search users..."
                className="me-2"
                value={query}
                onChange={handleSearch}
                style={{ backgroundColor: "#333", color: "white", border: "none" }}
              />
            </Form>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <ListGroup className="position-absolute w-100 mt-1 shadow" style={{ zIndex: 1050 }}>
                {searchResults.map((u) => (
                  <ListGroup.Item 
                    key={u._id} 
                    action 
                    as={Link} 
                    to={`/profile/${u._id}`} 
                    onClick={() => {
                      setSearchResults([]); // Close dropdown on click
                      setQuery("");         // Clear text
                    }}
                    className="d-flex align-items-center bg-dark text-white border-secondary"
                  >
                    {/* Small Avatar Placeholder */}
                    <div className="bg-primary rounded-circle me-2" style={{width: 30, height: 30}}></div>
                    {u.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>

          {/* Right Side Menu */}
          <Nav className="ms-auto d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {user ? (
              <>
                {/* 🛡️ ADMIN BUTTON (Only visible to Admins) */}
                {user.role === 'admin' && (
                  <Button as={Link} to="/admin/login" variant="danger" size="sm" className="fw-bold">
                    Admin
                  </Button>
                )}

                {/* Create New Post */}
                <Button variant="success" onClick={onShowCreate} className="fw-bold">
                  + Create
                </Button>

                {/* Profile Link */}
                <Button as={Link} to={`/profile/${user._id}`} variant="outline-light">
                  My Profile
                </Button>

                {/* Logout */}
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