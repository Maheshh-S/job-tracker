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

type CreateApplicationInput = {
  company: string;
  role: string;
  status: string;
  appliedDate: string;
  notes?: string;
};

export const createApplication = (data: CreateApplicationInput) => {
  return API.post("/applications", data).then((res) => res.data);
};

export const updateStatus = async (id: string, status: string) => {
  const res = await API.put(`/applications/${id}/status`, { status });
  return res.data;
};