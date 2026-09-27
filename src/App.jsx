import { useState } from "react";
import "./App.css";
import ListComponent from "./ListComponent";

function App() {
  return (
    <>
      <div className="App">
        <main className="ToDo-main">
          <h1>ToDoList-SX</h1>
          <ListComponent />
        </main>
      </div>
    </>
  );
}

export default App;
