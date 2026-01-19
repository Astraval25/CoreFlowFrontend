import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
          { refresh }   // send in body
        );

        const newToken = res.data.token;
        localStorage.setItem("token", newToken);

        originalRequest.headers.Authorization = Bearer`${newToken}`;
        return apiService(originalRequest);
      } catch (err) {
        console.error("Refresh failed", err);
        logout();
      }
    }

    return Promise.reject(error);
  }
);

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.href = "/";
}

export default api;
