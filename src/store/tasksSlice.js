import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTasks,
  getTask,
  addTask,
  updateTask,
  patchTask,
  deleteTask,
} from "../api/api";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const tasks = await getTasks();
  return tasks;
});

export const fetchTask = createAsyncThunk(
  "tasks/fetchTask",
  async (id, { rejectWithValue }) => {
    try {
      return await getTask(id);
    } catch (error) {
      return rejectWithValue(error.response?.status || 500);
    }
  },
);

export const addNewTask = createAsyncThunk("tasks/addNewTask", async (task) => {
  const newTask = await addTask(task);
  return newTask;
});

export const saveTask = createAsyncThunk("tasks/saveTask", async (task) => {
  const savedTask = await updateTask(task);
  return savedTask;
});

export const toggleTask = createAsyncThunk(
  "tasks/toggleTask",
  async ({ id, completed }) => {
    const updatedTask = await patchTask({ id, completed });
    return updatedTask;
  },
);

export const removeTask = createAsyncThunk("tasks/removeTask", async (id) => {
  await deleteTask(id);
  return id;
});

export const clearTasks = createAsyncThunk(
  "tasks/clearTasks",
  async (tasks) => {
    await Promise.all(tasks.map((task) => deleteTask(task.id)));
  },
);

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    currentTask: null,
    currentStatus: "idle",
    currentErrorCode: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchTask.pending, (state) => {
        state.currentStatus = "loading";
        state.currentTask = null;
        state.currentErrorCode = null;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.currentTask = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentErrorCode = action.payload;
      })
      .addCase(addNewTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(saveTask.fulfilled, (state, action) => {
        state.items = state.items.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        );
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        state.items = state.items.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        );
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task.id !== action.payload);
      })
      .addCase(clearTasks.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export default tasksSlice.reducer;
