import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) return <Loading />;
  if (isAuthenticated === false) return window.location.replace("/login");

  return children;
};

export default ProtectedRoute;
