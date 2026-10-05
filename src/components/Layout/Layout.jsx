import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuth, setAuth } from "../../api/api";

const linkClass = ({ isActive }) =>
  `px-3 py-1 rounded-xl transition-colors ${
    isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
  }`;

const Layout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: auth } = useQuery({
    queryKey: ["auth"],
    queryFn: getAuth,
    staleTime: Infinity,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => setAuth(false),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth"], data);
      navigate("/");
    },
    onError: () => navigate("/error-page"),
  });

  return (
    <div>
      <nav className="flex bg-gray-700 gap-4 p-4">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/todo-list" className={linkClass}>
          ToDoList
        </NavLink>
        <NavLink to="/about" className={linkClass}>
          About
        </NavLink>
        {auth?.isAuthenticated && (
          <button
            className="text-gray-400 hover:text-white ml-auto"
            onClick={() => logoutMutation.mutate()}
          >
            Logout
          </button>
        )}
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
