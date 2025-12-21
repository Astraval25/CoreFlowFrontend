import api from "../services/apiService";
import { ENDPOINTS } from "../../config/apiEndpoints";

export const coreApi = {
  login: (data) => api.post(ENDPOINTS.LOGIN, data),
};
