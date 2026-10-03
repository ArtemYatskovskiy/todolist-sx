import { useState, useEffect } from "react";
import ListItemComponent from "./ListItemComponent";
import ButtonComponent from "./ButtonComponent";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3030/";

const ListComponent = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [isEditSaving, setIsEditSaving] = useState(false);
  const [editError, setEditError] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    completed: false,
  });

  useEffect(() => {
    axios
      .get("tasks")
      .then((res) => setTasks(res.data))
      .catch(() => setError("Failed to load tasks"))
      .finally(() => setIsLoading(false));
  }, []);

  const onFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const onEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({ ...editForm, [name]: type === "checkbox" ? checked : value });
  };

  const saveHandler = async () => {
    setIsEditSaving(true);
    setEditError(null);
    try {
      const res = await axios.put(`tasks/${editId}`, editForm);
      setTasks((prev) => prev.map((t) => (t.id === editId ? res.data : t)));
      setEditId(null);
    } catch {
      setEditError("Failed to save task");
    } finally {
      setIsEditSaving(false);
    }
  };

  const addHandler = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const payloud = {
        ...form,
        creationDate: new Date().toISOString(),
      };
      const res = await axios.post("tasks", payloud);
      setTasks((prev) => [...prev, res.data]);
      setForm({ name: "", description: "", completed: false });
      setShowForm(false);
    } catch {
      setError("Failed to add task");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(`tasks/${id}`);
      setTasks((prev) => prev.filter((item) => item.id !== id));
    } catch {
      setError("Failed to delete task");
    }
  };

  const editHandler = async (id) => {
    setEditId(id);
    setEditForm(null);
    setEditError(null);
    setIsEditLoading(true);
    try {
      const res = await axios.get(`tasks/${id}`);
      setEditForm(res.data);
    } catch {
      setEditError("Failed to load task");
    } finally {
      setIsEditLoading(false);
    }
  };

  const clearHandler = async () => {
    try {
      await Promise.all(tasks.map((t) => axios.delete(`tasks/${t.id}`)));
      setTasks([]);
    } catch {
      setError("Failed to clear tasks");
    }
  };

  const toggleCompleted = async (task) => {
    try {
      const res = await axios.patch(`tasks/${task.id}`, {
        completed: !task.completed,
      });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
    } catch {
      setError("Failed to update task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    let matchesFilter = true;
    if (filter === "active") matchesFilter = !task.completed;
    if (filter === "completed") matchesFilter = task.completed;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-3 border-2 border-green-500 rounded-2xl shadow-xl p-6 bg-gray-800 w-full max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">ToDoListSX</h1>
        <select
          className="text-white"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
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
        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        onClick={() => setShowForm(true)}
      >
        Add
      </button>
      {showForm && (
        <div className="flex flex-col gap-2">
          <input
            className="bg-gray-700 text-white py-2 px-4 rounded-xl"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={onFormChange}
          />
          <textarea
            className="bg-gray-700 text-white py-2 px-4 rounded-xl"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={onFormChange}
          />
          <label className="text-white flex gap-2">
            <input
              type="checkbox"
              name="completed"
              checked={form.completed}
              onChange={onFormChange}
            />
            Completed
          </label>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
            onClick={addHandler}
            disabled={isSaving || form.name.trim().length < 3}
          >
            {isSaving ? "Saving..." : "Add"}
          </button>
        </div>
      )}
      {isLoading && <p className="text-gray-400 text-center">Loading...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}
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
                onChange={() => toggleCompleted(task)}
              />
              <ButtonComponent
                className="text-gray-500 cursor-pointer hover:text-red-400 shrink-0 transition-colors"
                text={"Edit"}
                onClick={() => editHandler(task.id)}
                type={"button"}
              />
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
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tasks yet</p>
      ) : (
        filteredTasks.length === 0 && (
          <p className="text-gray-500 text-center py-4">No tasks found</p>
        )
      )}
      <button
        className="bg-gray-700 cursor-pointer hover:bg-red-500/20 hover:text-red-400 text-gray-400 rounded-xl py-2 mt-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        onClick={clearHandler}
        disabled={tasks.length === 0}
      >
        Clear Tasks
      </button>
      {editId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md flex flex-col gap-3">
            <h2 className="text-white text-lg">Edit task</h2>

            {isEditLoading && <p className="text-gray-400">Loading...</p>}
            {editError && <p className="text-red-400 text-sm">{editError}</p>}

            {editForm && (
              <>
                <input
                  className="bg-gray-700 text-white py-2 px-4 rounded-xl"
                  name="name"
                  value={editForm.name}
                  onChange={onEditChange}
                />
                <textarea
                  className="bg-gray-700 text-white py-2 px-4 rounded-xl"
                  name="description"
                  value={editForm.description}
                  onChange={onEditChange}
                />
                <label className="text-white flex gap-2">
                  <input
                    type="checkbox"
                    name="completed"
                    checked={editForm.completed}
                    onChange={onEditChange}
                  />
                  Completed
                </label>
              </>
            )}

            <div className="flex gap-2 justify-end">
              <button
                className="text-gray-400 px-4"
                onClick={() => setEditId(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-xl disabled:opacity-50"
                onClick={saveHandler}
                disabled={!editForm || isEditSaving}
              >
                {isEditSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListComponent;
