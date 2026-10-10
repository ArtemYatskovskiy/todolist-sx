import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async () => {
    setIsPending(true);
    try {
      await login();
      navigate(location.state?.from?.pathname || "/todo-list", {
        replace: true,
      });
    } catch {
      navigate("/error");
    }
  };
  return (
    <div className="flex flex-col items-center gap-6 bg-gray-800 text-center p-8 text-white">
      <h1 className="text-3xl font-semibold">Login</h1>
      <p className="text-gray-300">Log in to see your tasks.</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-xl font-medium disabled:opacity-50"
        onClick={handleLogin}
        disabled={isPending}
      >
        {isPending ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default Login;
