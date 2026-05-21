import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const decodeCompanyId = () => {
  const token = localStorage.getItem("token");
  if (!token) return "";
  const decoded = jwtDecode(token);
  return decoded?.defaultComp?.[0] || "";
};

const useExpenses = () => {
  const [companyId, setCompanyId] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async (compId) => {
    if (!compId) return;
    setLoading(true);
    try {
      const res = await coreApi.getExpenses(compId, true);
      setExpenses(res?.data?.responseData || []);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const compId = decodeCompanyId();
    setCompanyId(compId);
    fetchExpenses(compId);
  }, []);

  const filteredExpenses = useMemo(() => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return expenses;
    return expenses.filter((expense) =>
      String(expense.expenseAccountName || "").toLowerCase().includes(q) ||
      String(expense.paymentMode || "").toLowerCase().includes(q) ||
      String(expense.invoiceNo || "").toLowerCase().includes(q) ||
      String(expense.vendorName || "").toLowerCase().includes(q) ||
      String(expense.customerName || "").toLowerCase().includes(q) ||
      String(expense.amount ?? "").toLowerCase().includes(q)
    );
  }, [expenses, globalFilter]);

  const deactivateExpense = async (expenseId) => {
    await coreApi.deactivateExpense(companyId, expenseId);
    fetchExpenses(companyId);
  };

  return {
    companyId,
    expenses,
    filteredExpenses,
    globalFilter,
    setGlobalFilter,
    loading,
    deactivateExpense,
    refreshExpenses: () => fetchExpenses(companyId),
  };
};

export default useExpenses;
