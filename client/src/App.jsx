import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import Navbar from "./components/Navbar"; 
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile"; // Ensure this component exists
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Area */}
          <Route element={<><Navbar /><Outlet /></>}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<CreatePost />} />
            
            {/* 🛡️ FIX: Added dynamic profile route */}
            <Route path="/profile/:id" element={<Profile />} /> 
          </Route>

          {/* Admin Area */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminDashboard />} />
            {/* 🛡️ FIX: Added content path to match your console error */}
            <Route path="content" element={<AdminDashboard />} /> 
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;