import { useState } from "react";
import ListItemComponent from "./ListItemComponent";
import ButtonComponent from "./ButtonComponent";
import useLocalStorage from "./useLocalStorage";

const ListComponent = () => {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const onChangeHandler = (e) => {
    const value = e.target.value;
    setInput(value);
  };

  const onClickAddHandler = (input) => {
    const updatedTasks = [
      ...tasks,
      { id: Date.now(), name: input, completed: false },
    ];
    setTasks(updatedTasks);
    setInput("");
  };

  const onKeyAddHandler = (e) => {
    if (isValid && e.key === "Enter") {
      onClickAddHandler(input.trim());
    }
  };

  const deleteHandler = (id) => {
    const finalTasks = tasks.filter((task) => task.id !== id);
    setTasks(finalTasks);
  };

  const clearHandler = () => {
    setTasks([]);
  };

  const toggleCompleted = (id) => {
    const completedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task,
    );
    setTasks(completedTasks);
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

  const minLength = 3;
  const maxLength = 35;

  const trimmedLength = input.trim().length;
  const isValid = trimmedLength >= minLength && trimmedLength <= maxLength;

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
      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-700 text-white py-2 px-4 border border-gray-600 rounded-xl outline-none focus:border-blue-500 transition-colors placeholder:text-gray-500"
          onKeyDown={onKeyAddHandler}
          onChange={onChangeHandler}
          maxLength={maxLength}
          value={input}
          placeholder="New Task"
        />
        <button
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 active:bg-blue-800 font-medium px-5 rounded-xl text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => onClickAddHandler(input.trim())}
          disabled={!isValid}
        >
          Add Task
        </button>
      </div>
      {input.length > 0 && trimmedLength < minLength && (
        <p className="text-red-400 text-sm">Minimum {minLength} characters</p>
      )}
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
                onChange={() => toggleCompleted(task.id)}
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
    </div>
  );
};

export default ListComponent;
