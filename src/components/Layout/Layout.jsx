import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const linkClass = ({ isActive }) =>
  `px-3 py-1 rounded-xl transition-colors ${
    isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
  }`;

const Layout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch {
      navigate("/error");
    }
  };

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
        {isAuthenticated && (
          <button
            className="text-gray-400 hover:text-white ml-auto"
            onClick={handleLogout}
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
