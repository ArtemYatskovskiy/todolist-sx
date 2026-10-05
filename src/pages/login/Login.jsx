import { useNavigate, useLocation } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setAuth } from "../../api/api";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: () => setAuth(true),
    onSuccess: (data) => {
      queryClient.setQueryData(["auth"], data);
      navigate(location.state?.from?.pathname || "/todo-list", {
        replace: true,
      });
    },
    onError: () => navigate("/error"),
  });

  return (
    <div className="flex flex-col items-center gap-6 bg-gray-800 text-center p-8 text-white">
      <h1 className="text-3xl font-semibold">Login</h1>
      <p className="text-gray-300">Log in to see your tasks.</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-xl font-medium disabled:opacity-50"
        onClick={() => loginMutation.mutate()}
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Logging in..." : "Login"}
      </button>
    </div>
  );
};

export default Login;
