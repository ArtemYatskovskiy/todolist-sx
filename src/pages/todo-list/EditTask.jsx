import { useEffect } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTask, updateTask } from "../../api/api";

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: task,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTask(id),
    retry: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (task) reset(task);
  }, [task, reset]);

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", id] });
      navigate("/todo-list");
    },
    onError: () => navigate("/error"),
  });

  const handleSave = (data) => {
    updateMutation.mutate({ ...task, ...data });
  };

  if (isError) {
    const path = error.response?.status === 404 ? "/not-found-page" : "/error";
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
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditTask;
