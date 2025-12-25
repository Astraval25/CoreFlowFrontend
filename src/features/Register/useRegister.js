import { coreApi } from "../../shared/services/coreApi";

export const useRegister = () => {
  const register = (credential) => {
    return coreApi.register(credential).then((res) => {
      const data = res.data;
      
      // Check if registration failed
      if (!data.responseStatus) {
        throw new Error(data.responseMessage || "Registration failed");
      }
      
      return data;
    });
  };
  return { register };
};
