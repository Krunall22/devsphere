import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import Navbar from "./components/Navbar"; 
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile"; // 👤 Ensure you have this file in your pages folder
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
    
    {/* 🛡️ FIX: Added the dynamic profile route */}
    <Route path="/profile/:id" element={<Profile />} /> 
  </Route>

  {/* Admin Area */}
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboard />} />
    {/* 🛡️ FIX: Added the specific 'content' path */}
    <Route path="content" element={<AdminDashboard />} /> 
  </Route>

  {/* 404 Fallback: Prevents white screen for unknown URLs */}
  <Route path="*" element={<div style={{padding: '50px', textAlign: 'center'}}><h1>404: Page Not Found</h1><a href="/">Go Home</a></div>} />
</Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;