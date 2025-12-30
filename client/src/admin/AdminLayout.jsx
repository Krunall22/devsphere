import { Outlet, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { Users, LayoutDashboard, FileText, LogOut } from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <Container fluid>
      <Row>
        {/* Sidebar for Admin Navigation */}
        <Col md={2} className="bg-dark text-white min-vh-100 p-3 shadow">
          <h4 className="mb-4 text-warning fw-bold">DevSphere Admin</h4>
          <Nav className="flex-column gap-2">
            <Nav.Link as={Link} to="/admin/dashboard" className="text-white d-flex align-items-center gap-2">
              <LayoutDashboard size={20} /> Dashboard
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/users" className="text-white d-flex align-items-center gap-2">
              <Users size={20} /> Manage Users
            </Nav.Link>
            <Nav.Link as={Link} to="/admin/content" className="text-white d-flex align-items-center gap-2">
              <FileText size={20} /> Manage Content
            </Nav.Link>
            <hr />
            <Button variant="outline-danger" size="sm" onClick={handleLogout} className="d-flex align-items-center gap-2">
              <LogOut size={18} /> Logout
            </Button>
          </Nav>
        </Col>

        {/* Main Content Area */}
        <Col md={10} className="p-4 bg-light">
          <Outlet /> {/* This renders the specific admin pages */}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout; // This line fixes the error in image_127ec2.png