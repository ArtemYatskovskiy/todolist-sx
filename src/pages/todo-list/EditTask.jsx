import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchTask, saveTask } from "../../store/tasksSlice";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const task = useSelector((state) => state.tasks.currentTask);
  const status = useSelector((state) => state.tasks.currentStatus);
  const errorCode = useSelector((state) => state.tasks.currentErrorCode);
  const isLoading = status === "loading";
  const isError = status === "failed";

  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchTask(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (task) reset(task);
  }, [task, reset]);

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      await dispatch(saveTask({ ...task, ...data })).unwrap();
      navigate("/todo-list");
    } catch {
      navigate("/error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isError) {
    const path = errorCode === 404 ? "/not-found-page" : "/error";
    return <Navigate to={path} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-800 flex items-center justify-center">
      <div className="flex flex-col gap-3 border-2 border-green-500 rounded-2xl shadow-xl p-6 bg-gray-800 w-full max-w-md mx-auto text-white">
        <h2 className="text-lg">Edit task</h2>

        {isLoading && <p className="text-gray-400">Loading...</p>}

        {task && (
          <>
            <input
              className="bg-gray-700 text-white py-2 px-4 border border-gray-600 rounded-xl outline-none focus:border-blue-500 transition-colors placeholder:text-gray-500"
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
              {...register("description")}
            />
            <label className="flex gap-2">
              <input type="checkbox" {...register("completed")} />
              Completed
            </label>
          </>
        )}

        <div className="flex gap-2 justify-end">
          <Link
            to="/todo-list"
            className="text-gray-400 hover:text-white px-4 py-2"
          >
            Cancel
          </Link>
          <Link
            to="/todo-list"
            onClick={handleSubmit(handleSave)}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-5 py-2 rounded-xl"
          >
            {isSaving ? "Saving..." : "Save"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
