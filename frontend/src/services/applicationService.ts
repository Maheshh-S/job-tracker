import API from "./authService";

export const getApplications = async () => {
  const res = await API.get("/applications");
  return res.data;
};

export const createApplication = async (data: {
  company: string;
  role: string;
  status: string;
  appliedDate: string;
}) => {
  const res = await API.post("/applications", data);
  return res.data;
};