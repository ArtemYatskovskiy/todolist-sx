import { Link } from "react-router-dom";

const Home = () => (
  <div className="flex flex-col gap-10 items-center w-full min-h-screen bg-gray-800 py-10">
    <h1 className=" text-white font-semibold">Welcome to ToDoListSX</h1>
    <p className=" text-gray-300">
      Here you can create tasks, edit them, mark them as completed, search and
      filter them by status. All data is stored on the server, so nothing will
      disappear after you reload the page.
    </p>
    <Link
      to="/todo-list"
      className="text-white
    "
    >
      Get started
    </Link>
  </div>
);

export default Home;
