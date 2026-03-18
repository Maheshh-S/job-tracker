import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

// Attach token automatically

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;


export const signupUser = async (email: string, password: string) => {
  const res = await API.post("/auth/signup", { email, password });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

