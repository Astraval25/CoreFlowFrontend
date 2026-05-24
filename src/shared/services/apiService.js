import axios from "axios";
import { emitAppError } from "../utils/appError";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

const isApiResponseEnvelope = (data) =>
  !!data &&
  typeof data === "object" &&
  Object.prototype.hasOwnProperty.call(data, "responseStatus") &&
  Object.prototype.hasOwnProperty.call(data, "responseMessage");

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Backend returns business errors inside ApiResponse with HTTP 200.
    if (isApiResponseEnvelope(response?.data) && response.data.responseStatus === false) {
      const businessError = new Error(
        response.data.responseMessage || "Request could not be processed."
      );
      businessError.response = response;
      businessError.config = response.config;
      emitAppError(businessError);
      return Promise.reject(businessError);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error?.config || {};

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/auth/refresh-token`,
          { refreshToken }   // send in body
        );

        const refreshData = res?.data?.responseData || res?.data || {};
        const newToken = refreshData?.token;
        const newRefreshToken = refreshData?.refreshToken;
        if (!newToken) throw new Error("Invalid refresh response");

        localStorage.setItem("token", newToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (err) {
        emitAppError(err, "Session expired. Please login again.");
        logout();
      }
    }

    if (!originalRequest.suppressGlobalError) {
      emitAppError(error);
    }

    return Promise.reject(error);
  }
);

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  window.location.href = "/cf/auth/login";
}

export default api;
