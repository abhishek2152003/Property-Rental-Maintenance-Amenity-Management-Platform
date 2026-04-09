import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:7001/api/auth",
});

export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);