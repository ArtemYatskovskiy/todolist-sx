import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center gap-6 text-center p-8 text-white">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <Link
        className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-xl font-medium"
        to={"/home"}
      >
        Go to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
