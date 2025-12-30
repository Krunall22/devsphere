import { useEffect, useState } from "react";
import { Table, Button, Badge, Tabs, Tab, Image } from "react-bootstrap";
import axios from "axios";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [key, setKey] = useState('users'); // Active Tab state

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // --- FETCH DATA ---
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get("https://devsphere-gz00.onrender.com/api/admin/users", config);
      setUsers(data);
    } catch (err) { console.error("Error fetching users"); }
  };

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("https://devsphere-gz00.onrender.com/api/admin/posts", config);
      setPosts(data);
    } catch (err) { console.error("Error fetching posts"); }
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  // --- ACTIONS ---
  const toggleBlock = async (id, currentStatus) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? "Unblock" : "Block"} this user?`)) {
      await axios.put(`https://devsphere-gz00.onrender.com/api/admin/block/${id}`, {}, config);
      fetchUsers(); // Refresh list
    }
  };

  const deletePost = async (id) => {
    if (window.confirm("⚠️ WARNING: This will permanently delete this post/poll. Continue?")) {
      try {
        await axios.delete(`https://devsphere-gz00.onrender.com/api/admin/post/${id}`, config);
        fetchPosts(); // Refresh list
      } catch (error) {
        alert("Error deleting post");
      }
    }
  };

  // Add this specific delete function to your AdminDashboard
const deleteInappropriateContent = async (postId) => {
  if (window.confirm("⚠️ This post violates community standards (18+ content). Delete permanently?")) {
    try {
      await axios.delete(`https://devsphere-gz00.onrender.com/api/admin/post/${postId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert("Content removed successfully.");
      fetchPosts(); // Refresh your admin list
    } catch (err) {
      alert("Error deleting content.");
    }
  }
};

  return (
    <div>
      <h2 className="mb-4">⚡ Control Center</h2>
      
      <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-4">
        
        {/* TAB 1: USER MANAGEMENT */}
        <Tab eventKey="users" title="👥 User Database">
          <Table hover bordered className="bg-white shadow-sm">
            <thead className="bg-light">
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
                  <td className="fw-bold">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === 'admin' ? 'warning' : 'info'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td>
                    {user.isBlocked ? 
                      <Badge bg="danger">⛔ Banned</Badge> : 
                      <Badge bg="success">Active</Badge>
                    }
                  </td>
                  <td>
                    {user.role !== 'admin' && (
                      <Button 
                        size="sm" 
                        variant={user.isBlocked ? "secondary" : "danger"} 
                        onClick={() => toggleBlock(user._id, user.isBlocked)}
                      >
                        {user.isBlocked ? "Unblock" : "Block User"}
                      </Button>

                    )}
                    <Button 
  variant="danger" 
  size="sm" 
  onClick={() => handleDelete(post._id)}
>
  🚨 Remove 18+ Content
</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>

        {/* TAB 2: CONTENT MANAGEMENT */}
        <Tab eventKey="posts" title="📝 Manage Content">
          <Table hover bordered className="bg-white shadow-sm">
            <thead className="bg-light">
              <tr>
                <th>Type</th>
                <th>Author</th>
                <th>Content Preview</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id}>
                  <td>
                    <Badge bg={post.type === 'poll' ? 'primary' : 'success'}>
                      {post.type === 'poll' ? '📊 Poll' : '🖼️ Post'}
                    </Badge>
                  </td>
                  <td>
                    <span className="fw-bold">{post.user?.name || "Unknown"}</span>
                    <br />
                    <small className="text-muted">{post.user?.email}</small>
                  </td>
                  <td>
                    <strong>{post.title}</strong>
                    <br />
                    <small className="text-muted">{post.description?.substring(0, 50)}...</small>
                  </td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button 
                      size="sm" 
                      variant="outline-danger" 
                      onClick={() => deletePost(post._id)}
                    >
                      🗑️ Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      
      </Tabs>
    </div>
  );
};

export default AdminDashboard;