import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function ProtectedRoute({ children }) {

  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/UserLogin" state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;