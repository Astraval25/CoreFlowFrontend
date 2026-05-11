import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";
import { ACCOUNT_TYPES } from "../constants";

const decodeCompanyId = () => {
  const token = localStorage.getItem("token");
  if (!token) return "";
  const decoded = jwtDecode(token);
  return decoded?.defaultComp?.[0] || "";
};

const useCreateExpenseAccount = (expenseAccountId = null) => {
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    accountType: "Expense",
    accountName: "",
  });

  useEffect(() => {
    const compId = decodeCompanyId();
    setCompanyId(compId);

    if (!compId || !expenseAccountId) return;

    coreApi
      .getExpenseAccountDetail(compId, expenseAccountId)
      .then((res) => {
        const data = res?.data?.responseData;
        if (!data) return;
        setFormData({
          accountType: data.accountType || "Expense",
          accountName: data.accountName || "",
        });
      })
      .catch((error) => {
        console.error("Failed to fetch expense account:", error);
        setErrors({ submit: "Failed to load expense account" });
      });
  }, [expenseAccountId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.accountType) nextErrors.accountType = "Account type is required";
    if (!formData.accountName.trim()) nextErrors.accountName = "Account name is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitAccount = async () => {
    if (!validate()) return false;
    setLoading(true);
    try {
      const payload = {
        accountType: formData.accountType,
        accountName: formData.accountName.trim(),
      };
      if (expenseAccountId) {
        await coreApi.updateExpenseAccount(companyId, expenseAccountId, payload);
      } else {
        await coreApi.createExpenseAccount(companyId, payload);
      }
      return true;
    } catch (error) {
      setErrors({
        submit:
          error?.response?.data?.responseMessage ||
          `Failed to ${expenseAccountId ? "update" : "create"} expense account`,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    companyId,
    accountTypes: ACCOUNT_TYPES,
    formData,
    errors,
    loading,
    handleChange,
    submitAccount,
  };
};

export default useCreateExpenseAccount;
