import { coreApi } from "../../shared/services/coreApi";

export const useLogin = () => {
  const login = async (credentials) => {
    try {
      const res = await coreApi.login(credentials);
      const data = res.data;

      if (!data.responseStatus) {
        throw new Error(data.responseMessage || "Login failed");
      }

      if (data.responseData?.token) {
        localStorage.setItem("token", data.responseData.token);
        localStorage.setItem("refreshToken", data.responseData.refreshToken);
      }

      return data;
    } catch (error) {
      const message =
        error.response?.data?.responseMessage ||
        error.message ||
        "Something went wrong";

      throw new Error(message);
    }
  };

  return { login };
};
