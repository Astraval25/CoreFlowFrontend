import { coreApi } from "../../shared/services/coreApi";

export const useLogin = () => {
  const login = (credentials) => {
    return coreApi.login(credentials).then((res) => {
      const data = res.data;

      // If login failed
      if (!data.responseStatus) {
        throw new Error(data.responseData.email || "Login failed");
      }

      if (data.responseData?.token) {
        localStorage.setItem("token", data.responseData.token);
        localStorage.setItem("refreshToken", data.responseData.refreshToken);
      }

      return data;
    });
  };

  return { login };
};
