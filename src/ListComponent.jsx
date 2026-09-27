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
    <>
      <input
        onKeyDown={onKeyAddHandler}
        onChange={onChangeHandler}
        value={input}
        placeholder="New Task"
      />
      <h2>{tasks.length}</h2>
      <ul>
        {tasks.map((task) => (
          <ListItemComponent key={task.id} name={task.name}>
            {
              <ButtonComponent
                text={"X"}
                onClick={() => deleteHandler(task.id)}
                type={"button"}
              />
            }
          </ListItemComponent>
        ))}
      </ul>
      <button onClick={() => onClickAddHandler(input)}>Add Task</button>
      <button onClick={clearHandler}>Clear Tasks</button>
    </>
  );
};

export default ListComponent;
