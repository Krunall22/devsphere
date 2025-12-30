import { useEffect, useState } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // 1. Fetch All Users
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("https://devsphere-gz00.onrender.com/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data);
    } catch (error) {
      alert("Failed to fetch users. Are you an admin?");
    }
  };

  // 2. Block a User
  const blockUser = async (id) => {
    if (window.confirm("Are you sure you want to block this user?")) {
      try {
        await axios.put(
          `https://devsphere-gz00.onrender.com/api/admin/block/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("User Blocked!");
        fetchUsers(); // Refresh list
      } catch (error) {
        alert("Error blocking user");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">🛡️ Admin Dashboard</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.role === "admin" ? "danger" : "primary"}>
                  {user.role || "user"}
                </Badge>
              </td>
              <td>
                {user.isBlocked ? (
                  <Badge bg="dark">⛔ Banned</Badge>
                ) : (
                  <Badge bg="success">Active</Badge>
                )}
              </td>
              <td>
                {user.role !== "admin" && !user.isBlocked && (
                  <Button variant="danger" size="sm" onClick={() => blockUser(user._id)}>
                    Block User
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;