import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header"; 
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";

// IMPORT ADMIN FILES
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌍 PUBLIC ROUTES (Blue Header) */}
        <Route element={<><Header /><Outlet /></>}>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create" element={<CreatePost />} />
        </Route>

        {/* 🔒 ADMIN ROUTES (Black Sidebar) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminDashboard />} /> {/* Reusing for now */}
        </Route>

      </Routes>
    </Router>
  );
}

export default App;