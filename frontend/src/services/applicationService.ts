import API from "./authService";

export const getApplications = async () => {
  const res = await API.get("/applications");
  return res.data;
};