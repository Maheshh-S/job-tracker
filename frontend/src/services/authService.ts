import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

export const signupUser = async (email: string, password: string) => {
  const res = await API.post("/auth/signup", { email, password });
  return res.data;
};