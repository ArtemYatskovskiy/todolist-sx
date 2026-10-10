import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import ListItemComponent from "./ListItemComponent";
import ButtonComponent from "./ButtonComponent";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  fetchTasks,
  addNewTask,
  toggleTask,
  removeTask,
  clearTasks,
} from "../../store/tasksSlice";

const ListComponent = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const goToError = () => navigate("/error");
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks.items);
  const status = useSelector((state) => state.tasks.status);
  const isLoading = status === "loading";
  const isError = status === "failed";
  const [isSaving, setIsSaving] = useState(false);

  const onAddSubmit = async (data) => {
    setIsSaving(true);
    try {
      await dispatch(
        addNewTask({ ...data, creationDate: new Date().toISOString() }),
      ).unwrap();
      reset();
      setShowForm(false);
    } catch {
      goToError();
    } finally {
      setIsSaving(false);
    }
  };

  const toggleHandler = async (task) => {
    try {
      await dispatch(
        toggleTask({ id: task.id, completed: !task.completed }),
      ).unwrap();
    } catch {
      goToError();
    }
  };

  const deleteHandler = async (id) => {
    try {
      await dispatch(removeTask(id)).unwrap();
    } catch {
      goToError();
    }
  };

  const clearHandler = async () => {
    try {
      await dispatch(clearTasks(tasks)).unwrap();
    } catch {
      goToError();
    }
  };

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", description: "", completed: false },
  });

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    let matchesFilter = true;
    if (filter === "active") matchesFilter = !task.completed;
    if (filter === "completed") matchesFilter = task.completed;
    return matchesSearch && matchesFilter;
  });

  if (isError) return <Navigate to="/error" replace />;

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="flex flex-col gap-3 border-2 border-green-500 rounded-2xl shadow-xl p-6 bg-gray-800 w-full max-w-2xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-white">ToDoList</h1>
          <select
            className="text-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
          <input
            className="bg-gray-700 text-white py-2 px-4 border border-gray-600 rounded-xl outline-none focus:border-blue-500 transition-colors placeholder:text-gray-500"
            type="search"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <h2 className="text-gray-400 text-sm">{tasks.length} tasks</h2>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-xl cursor-pointer"
          onClick={() => setShowForm(true)}
        >
          Add
        </button>

        {showForm && (
          <form
            onSubmit={handleSubmit(onAddSubmit)}
            className="flex flex-col gap-2"
          >
            <input
              className="bg-gray-700 text-white py-2 px-4 border border-gray-600 rounded-xl outline-none focus:border-blue-500 transition-colors placeholder:text-gray-500"
              placeholder="Name"
              {...register("name", {
                validate: (v) => v.trim().length >= 3 || "Minimum 3 characters",
                maxLength: { value: 35, message: "Maximum 35 characters" },
              })}
            />
            {errors.name && (
              <p className="text-red-400 text-sm">{errors.name.message}</p>
            )}
            <textarea
              className="bg-gray-700 text-white py-2 px-4 border border-gray-600 rounded-xl outline-none focus:border-blue-500 transition-colors placeholder:text-gray-500"
              placeholder="Description"
              {...register("description")}
            />
            <label className="text-white flex gap-2">
              <input type="checkbox" {...register("completed")} />
              Completed
            </label>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded-xl disabled:opacity-50 cursor-pointer"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Add"}
            </button>
          </form>
        )}

        {isLoading && <p className="text-gray-400 text-center">Loading...</p>}

        <ul className="flex flex-col gap-2">
          {filteredTasks.map((task) => (
            <ListItemComponent
              className="flex items-center justify-between bg-gray-700 hover:bg-gray-700/80 text-white rounded-xl px-4 py-3 transition-colors"
              key={task.id}
              name={task.name}
              completed={task.completed}
            >
              <div className="flex gap-5">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleHandler(task)}
                />
                <Link
                  to={`/todo-list/${task.id}`}
                  className="text-gray-500 cursor-pointer hover:text-red-400 transition-colors"
                >
                  Edit
                </Link>
                <ButtonComponent
                  className="text-gray-500 cursor-pointer hover:text-red-400 shrink-0 transition-colors"
                  text={"✕"}
                  onClick={() => deleteHandler(task.id)}
                  type={"button"}
                />
              </div>
            </ListItemComponent>
          ))}
        </ul>

        {!isLoading && !isError && tasks.length === 0 && (
          <p className="text-gray-500 text-center py-4">No tasks yet</p>
        )}
        {tasks.length > 0 && filteredTasks.length === 0 && (
          <p className="text-gray-500 text-center py-4">No tasks found</p>
        )}

        <button
          className="bg-gray-700 cursor-pointer hover:bg-red-500/20 hover:text-red-400 text-gray-400 rounded-xl py-2 mt-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={clearHandler}
          disabled={tasks.length === 0}
        >
          Clear Tasks
        </button>
      </div>
    </div>
  );
};

export default ListComponent;
