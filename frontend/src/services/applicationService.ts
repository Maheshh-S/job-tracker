import API from "./authService";

export const getApplications = async (filters?: {
  status?: string;
  date?: string;
}) => {
  const params = new URLSearchParams();

  if (filters?.status) params.append("status", filters.status);
  if (filters?.date) params.append("date", filters.date);

  const res = await API.get(`/applications?${params.toString()}`);
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

export const updateStatus = async (id: string, status: string) => {
  const res = await API.put(`/applications/${id}/status`, { status });
  return res.data;
};