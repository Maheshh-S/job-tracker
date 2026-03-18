import axios from "axios";

const API = axios.create({
  baseURL: "https://job-tracker-backend-58pv.onrender.com/api",
});

// Attach token automatically

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(
          "https://job-tracker-backend-58pv.onrender.com/api/auth/refresh",
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch (err) {
        // logout if refresh fails
        localStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);


export default API;


export const signupUser = async (email: string, password: string) => {
  const res = await API.post("/auth/signup", { email, password });
  return res.data;
};

export const loginUser = async (email: string, password: string) => {
  const res = await API.post("/auth/login", { email, password });
  return res.data;
};

