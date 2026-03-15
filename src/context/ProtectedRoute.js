import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children }) {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/UserLogin" />;
  }

  return children;
}

export default ProtectedRoute;