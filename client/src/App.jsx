import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // 🛡️ Import AuthProvider
import Navbar from "./components/Navbar"; 
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile"; // 👤 Added Profile Page

// IMPORT ADMIN FILES
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";

function App() {
  return (
    <AuthProvider> {/* 🛡️ MUST wrap the app to fix the 'undefined user' error */}
      <Router>
        <Routes>
          {/* 🌍 PUBLIC ROUTES (With Navbar) */}
          <Route element={<><Navbar /><Outlet /></>}>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/profile/:id" element={<Profile />} /> {/* Dynamic Profile */}
          </Route>

          {/* 🔒 ADMIN ROUTES */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            {/* These paths allow the Admin to manage Users and Content specifically */}
            <Route path="users" element={<AdminDashboard />} /> 
            <Route path="content" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;