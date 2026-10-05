import axios from "axios";

axios.defaults.baseURL = "http://localhost:3030/";

export const getTasks = () => axios.get("tasks").then((res) => res.data);

export const getTask = (id) => axios.get(`tasks/${id}`).then((res) => res.data);

export const addTask = (task) =>
  axios.post("tasks", task).then((res) => res.data);

export const updateTask = ({ id, ...task }) =>
  axios.put(`tasks/${id}`, task).then((res) => res.data);

export const patchTask = ({ id, ...data }) =>
  axios.patch(`tasks/${id}`, data).then((res) => res.data);

export const deleteTask = (id) => axios.delete(`tasks/${id}`);

export const getAuth = () => axios.get("auth").then((res) => res.data);

export const setAuth = (isAuthenticated) =>
  axios.patch("auth", { isAuthenticated }).then((res) => res.data);
