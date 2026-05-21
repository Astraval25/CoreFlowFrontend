import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const decodeCompanyId = () => {
  const token = localStorage.getItem("token");
  if (!token) return "";
  const decoded = jwtDecode(token);
  return decoded?.defaultComp?.[0] || "";
};

const useExpenseAccounts = () => {
  const [companyId, setCompanyId] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async (compId) => {
    if (!compId) return;
    setLoading(true);
    try {
      const res = await coreApi.getExpenseAccounts(compId, false);
      setAccounts(res?.data?.responseData || []);
    } catch (error) {
      console.error("Failed to fetch expense accounts:", error);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const compId = decodeCompanyId();
    setCompanyId(compId);
    fetchAccounts(compId);
  }, []);

  const filteredAccounts = useMemo(() => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return accounts;
    return accounts.filter((account) =>
      String(account.accountName || "").toLowerCase().includes(q) ||
      String(account.accountType || "").toLowerCase().includes(q)
    );
  }, [accounts, globalFilter]);

  const deactivateAccount = async (expenseAccountId) => {
    await coreApi.deactivateExpenseAccount(companyId, expenseAccountId);
    fetchAccounts(companyId);
  };

  const activateAccount = async (expenseAccountId) => {
    await coreApi.activateExpenseAccount(companyId, expenseAccountId);
    fetchAccounts(companyId);
  };

  return {
    companyId,
    accounts,
    filteredAccounts,
    globalFilter,
    setGlobalFilter,
    loading,
    deactivateAccount,
    activateAccount,
    refreshAccounts: () => fetchAccounts(companyId),
  };
};

export default useExpenseAccounts;
