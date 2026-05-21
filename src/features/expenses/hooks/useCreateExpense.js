import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";
import { PAYMENT_MODES } from "../constants";

const today = () => new Date().toISOString().slice(0, 10);

const decodeCompanyId = () => {
  const token = localStorage.getItem("token");
  if (!token) return "";
  const decoded = jwtDecode(token);
  return decoded?.defaultComp?.[0] || "";
};

const normalizeDate = (value) => {
  if (!value) return today();
  return String(value).slice(0, 10);
};

const useCreateExpense = (expenseId = null, salaryPeriodId = null) => {
  const [companyId, setCompanyId] = useState("");
  const [expenseAccounts, setExpenseAccounts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [salaryContext, setSalaryContext] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    expenseDate: today(),
    paymentMode: "BANK_TRANSFER",
    amount: "",
    expenseAccountId: "",
    invoiceNo: "",
    vendorId: "",
    customerId: "",
    remark: "",
  });

  const fetchExpense = async (compId, id) => {
    try {
      const res = await coreApi.getExpenseDetail(compId, id);
      const data = res?.data?.responseData;
      if (!data) return;
      setFormData({
        expenseDate: normalizeDate(data.expenseDate),
        paymentMode: data.paymentMode || "BANK_TRANSFER",
        amount: data.amount ?? "",
        expenseAccountId: data.expenseAccountId ? String(data.expenseAccountId) : "",
        invoiceNo: data.invoiceNo || "",
        vendorId: data.vendorId ? String(data.vendorId) : "",
        customerId: data.customerId ? String(data.customerId) : "",
        remark: data.remark || "",
      });
      setSalaryContext(null);
    } catch (error) {
      console.error("Failed to fetch expense:", error);
      setErrors({ submit: "Failed to load expense" });
    }
  };

  const applySalaryPrefill = async (compId, currentExpenseAccounts) => {
    if (!salaryPeriodId || expenseId) return;

    try {
      const res = await coreApi.getSalaryPeriodDetail(compId, salaryPeriodId);
      const detail = res?.data?.responseData;
      if (!detail) return;

      const salaryAccount = currentExpenseAccounts.find(
        (account) => String(account.accountName || "").trim().toLowerCase() === "salary"
      );

      const balanceAmount = Number(detail.balanceAmount ?? detail.netAmount ?? 0);
      setSalaryContext(detail);
      setFormData((prev) => ({
        ...prev,
        expenseDate: normalizeDate(detail.toDate),
        paymentMode: prev.paymentMode || "BANK_TRANSFER",
        amount: balanceAmount > 0 ? balanceAmount : prev.amount,
        expenseAccountId: salaryAccount ? String(salaryAccount.expenseAccountId) : prev.expenseAccountId,
        invoiceNo: `SALARY-${detail.salaryPeriodId}-${detail.paymentCount + 1}`,
        remark: `Salary payment for ${detail.employeeName} (${detail.fromDate} to ${detail.toDate})`,
      }));
    } catch (error) {
      console.error("Failed to fetch salary detail:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error?.response?.data?.responseMessage || "Failed to load salary payment details",
      }));
    }
  };

  useEffect(() => {
    const compId = decodeCompanyId();
    setCompanyId(compId);
    if (!compId) return;
    (async () => {
      try {
        const [accountsRes, vendorsRes, customersRes] = await Promise.all([
          coreApi.getExpenseAccounts(compId, true),
          coreApi.getAllVendorByCompanyId(compId),
          coreApi.getAllCustomerByCompanyId(compId),
        ]);
        const accounts = accountsRes?.data?.responseData || [];
        setExpenseAccounts(accounts);
        setVendors(vendorsRes?.data?.responseData || []);
        setCustomers(customersRes?.data?.responseData || []);

        if (expenseId) {
          await fetchExpense(compId, expenseId);
        } else {
          await applySalaryPrefill(compId, accounts);
        }
      } catch (error) {
        console.error("Failed to fetch expense lookups:", error);
      }
    })();
  }, [expenseId, salaryPeriodId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.expenseDate) nextErrors.expenseDate = "Date is required";
    if (!formData.paymentMode) nextErrors.paymentMode = "Payment mode is required";
    if (formData.amount === "" || Number.isNaN(Number(formData.amount))) {
      nextErrors.amount = "Amount is required";
    }
    if (!formData.expenseAccountId) nextErrors.expenseAccountId = "Expense account is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submitExpense = async () => {
    if (!validate()) return false;
    setLoading(true);
    try {
      const payload = {
        expenseDate: formData.expenseDate,
        paymentMode: formData.paymentMode,
        amount: Number(formData.amount),
        expenseAccountId: Number(formData.expenseAccountId),
        invoiceNo: formData.invoiceNo || null,
        vendorId: formData.vendorId ? Number(formData.vendorId) : null,
        customerId: formData.customerId ? Number(formData.customerId) : null,
        remark: formData.remark || null,
        salaryPeriodId: salaryPeriodId ? Number(salaryPeriodId) : null,
      };
      if (expenseId) {
        await coreApi.updateExpense(companyId, expenseId, payload);
      } else {
        await coreApi.createExpense(companyId, payload);
      }
      return true;
    } catch (error) {
      setErrors({
        submit:
          error?.response?.data?.responseMessage ||
          `Failed to ${expenseId ? "update" : "create"} expense`,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    companyId,
    expenseAccounts,
    vendors,
    customers,
    salaryContext,
    paymentModes: PAYMENT_MODES,
    formData,
    errors,
    loading,
    handleChange,
    submitExpense,
  };
};

export default useCreateExpense;
