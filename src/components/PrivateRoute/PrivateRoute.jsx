import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "../../api/api";

const PrivateRoute = () => {
  const location = useLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth"],
    queryFn: getAuth,
    staleTime: Infinity,
    retry: false,
  });

  if (isLoading) {
    return <p className="text-center">Loading...</p>;
  }

  if (isError) return <Navigate to="/error" replace />;

  if (!data.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
