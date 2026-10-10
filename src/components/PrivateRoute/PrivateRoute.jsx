import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PrivateRoute = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, isError } = useAuth();

  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  if (isError) return <Navigate to="/error" replace />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
