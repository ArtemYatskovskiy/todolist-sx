import { useState } from "react";
import ListItemComponent from "./ListItemComponent";
import ButtonComponent from "./ButtonComponent";
import useLocalStorage from "./useLocalStorage";

const ListComponent = () => {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useLocalStorage("tasks", []);

  const onChangeHandler = (e) => {
    const value = e.target.value;
    setInput(value);
  };

  const onClickAddHandler = (input) => {
    const updatedTasks = [...tasks, { id: Date.now(), name: input }];
    setTasks(updatedTasks);
    setInput("");
  };

  const onKeyAddHandler = (e) => {
    if (e.key === "Enter") {
      onClickAddHandler(input);
    }
  };

  const deleteHandler = (id) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };

  const clearHandler = () => {
    setTasks([]);
  };

  return (
    <div className="flex flex-col gap-2 border-2 border-green-500 rounded-2xl shadow-xl p-6 bg-gray-800">
      <div className="flex justify-between">
        <h1 className="text-xl font-semibold text-white">ToDoListSX</h1>
        <h2 className="text-gray-400 text-sm">{tasks.length} tasks</h2>
      </div>
      <div className="flex gap-2">
        <input
          className="bg-gray-700 text-white px-4 border rounded-xl"
          onKeyDown={onKeyAddHandler}
          onChange={onChangeHandler}
          value={input}
          placeholder="New Task"
        />
        <button
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 font-medium px-5 rounded-lg text-white"
          onClick={() => onClickAddHandler(input)}
        >
          Add Task
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {tasks.map((task) => (
          <ListItemComponent
            className="flex items-center justify-between bg-gray-700 text-white rounded-lg px-4 py-3"
            key={task.id}
            name={task.name}
          >
            <ButtonComponent
              className="text-gray-500 hover:text-white shrink-0"
              text={"✕"}
              onClick={() => deleteHandler(task.id)}
              type={"button"}
            />
          </ListItemComponent>
        ))}
      </ul>
      {tasks.length === 0 && <p className="text-white">No found</p>}
      <button
        className="bg-gray-700 cursor-pointer hover:bg-gray-900 text-gray-400 rounded-lg py-2 mt-2"
        onClick={clearHandler}
      >
        Clear Tasks
      </button>
    </div>
  );
};

export default ListComponent;
