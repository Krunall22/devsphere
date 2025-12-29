import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("userInfo"));

  if (!user || !user.token) {
    // If no user found, force redirect to Login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;