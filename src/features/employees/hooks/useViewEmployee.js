import { useEffect, useState } from "react";
import { coreApi } from "../../../shared/services/coreApi";
import { jwtDecode } from "jwt-decode";

export const useViewEmployee = (employeeId) => {
  const [companyId, setCompanyId] = useState("");
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // Portal user
  const [portalUser, setPortalUser] = useState(null);
  const [portalForm, setPortalForm] = useState({ username: "", password: "" });
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState("");

  // Salary config
  const [salaryForm, setSalaryForm] = useState({
    salaryType: "MONTHLY",
    monthlyAmount: "",
    effectiveFrom: "",
  });
  const [salaryLoading, setSalaryLoading] = useState(false);
  const [salaryError, setSalaryError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const compId = decode.defaultComp[0];
    setCompanyId(compId);

    if (employeeId) {
      coreApi
        .getEmployeeDetail(compId, employeeId)
        .then((res) => setEmployee(res.data.responseData || null))
        .catch((err) => console.error("Employee detail error:", err))
        .finally(() => setLoading(false));

      coreApi
        .getPortalUser(compId, employeeId)
        .then((res) => setPortalUser(res.data.responseData || null))
        .catch(() => setPortalUser(null));
    }
  }, [employeeId]);

  const createPortalUser = async () => {
    if (!portalForm.username || !portalForm.password) {
      setPortalError("Username and password are required.");
      return;
    }
    setPortalLoading(true);
    setPortalError("");
    try {
      await coreApi.createPortalUser(companyId, employeeId, portalForm);
      const res = await coreApi.getPortalUser(companyId, employeeId);
      setPortalUser(res.data.responseData || null);
      setPortalForm({ username: "", password: "" });
    } catch (err) {
      setPortalError(err.response?.data?.responseMessage || "Failed to create portal user.");
    } finally {
      setPortalLoading(false);
    }
  };

  const resetPortalPassword = async (newPassword) => {
    setPortalLoading(true);
    setPortalError("");
    try {
      await coreApi.resetPortalUserPassword(companyId, employeeId, { password: newPassword });
    } catch (err) {
      setPortalError(err.response?.data?.responseMessage || "Failed to reset password.");
    } finally {
      setPortalLoading(false);
    }
  };

  const createSalaryConfig = async () => {
    if (!salaryForm.effectiveFrom) {
      setSalaryError("Effective from date is required.");
      return;
    }
    setSalaryLoading(true);
    setSalaryError("");
    try {
      await coreApi.createSalaryConfig(companyId, employeeId, {
        salaryType: salaryForm.salaryType,
        monthlyAmount: Number(salaryForm.monthlyAmount) || 0,
        effectiveFrom: salaryForm.effectiveFrom,
      });
      const res = await coreApi.getEmployeeDetail(companyId, employeeId);
      setEmployee(res.data.responseData || null);
      setSalaryForm({ salaryType: "MONTHLY", monthlyAmount: "", effectiveFrom: "" });
    } catch (err) {
      setSalaryError(err.response?.data?.responseMessage || "Failed to create salary config.");
    } finally {
      setSalaryLoading(false);
    }
  };

  return {
    employee,
    loading,
    companyId,
    portalUser,
    portalForm,
    setPortalForm,
    portalLoading,
    portalError,
    createPortalUser,
    resetPortalPassword,
    salaryForm,
    setSalaryForm,
    salaryLoading,
    salaryError,
    createSalaryConfig,
  };
};
