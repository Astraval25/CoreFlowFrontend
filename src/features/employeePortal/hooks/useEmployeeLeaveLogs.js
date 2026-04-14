import { useEffect, useState, useCallback } from "react";
import { coreApi } from "../../../shared/services/coreApi";
import { jwtDecode } from "jwt-decode";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const getMonthRange = () => {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = (d) => d.toISOString().split("T")[0];
  return { from: fmt(from), to: fmt(to) };
};

export const useEmployeeLeaveLogs = () => {
  const [leaveLogs, setLeaveLogs] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(getMonthRange);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [form, setForm] = useState({
    leaveDate: new Date().toISOString().split("T")[0],
    leaveType: "FULL_DAY",
    leaveCategory: "SICK",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decode = jwtDecode(token);
      setCompanyId(decode.defaultComp?.[0] ?? "");
      setEmployeeId(decode.empId ?? decode.sub ?? "");
    } catch {
      // ignore
    }
  }, []);

  const fetchLeaveLogs = useCallback(() => {
    setLoading(true);
    setError("");
    coreApi
      .getMyLeaveLogs(dateRange.from, dateRange.to)
      .then((res) => setLeaveLogs(res.data.responseData || []))
      .catch((err) => console.error("Leave logs fetch error:", err))
      .finally(() => setLoading(false));
  }, [dateRange]);

  useEffect(() => {
    fetchLeaveLogs();
  }, [fetchLeaveLogs]);

  const openCreate = () => {
    setEditingLog(null);
    setForm({
      leaveDate: new Date().toISOString().split("T")[0],
      leaveType: "FULL_DAY",
      leaveCategory: "SICK",
      reason: "",
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (log) => {
    setEditingLog(log);
    setForm({
      leaveDate: log.leaveDate,
      leaveType: log.leaveType || "FULL_DAY",
      leaveCategory: log.leaveCategory || "SICK",
      reason: log.reason || "",
    });
    setError("");
    setShowModal(true);
  };

  const submitForm = async () => {
    if (!form.leaveDate || !form.leaveType || !form.leaveCategory) {
      setError("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    const payload = {
      employeeId: Number(employeeId),
      leaveDate: form.leaveDate,
      leaveType: form.leaveType,
      leaveCategory: form.leaveCategory,
      reason: form.reason,
    };
    try {
      if (editingLog) {
        await coreApi.updateLeaveLog(companyId, payload);
      } else {
        await coreApi.createLeaveLog(companyId, payload);
      }
      setShowModal(false);
      fetchLeaveLogs();
    } catch (err) {
      const msg = err.response?.data?.responseMessage || "Failed to save leave log.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("leaveDate", { header: "Date" }),
    columnHelper.accessor("leaveType", { header: "Type" }),
    columnHelper.accessor("leaveCategory", { header: "Category" }),
    columnHelper.accessor("reason", { header: "Reason" }),
    columnHelper.accessor("status", { header: "Status" }),
    columnHelper.accessor("_actions", { header: "Action" }),
  ];

  const table = useReactTable({
    data: leaveLogs,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return {
    table,
    globalFilter,
    setGlobalFilter,
    loading,
    dateRange,
    setDateRange,
    fetchLeaveLogs,
    showModal,
    setShowModal,
    editingLog,
    openCreate,
    openEdit,
    form,
    setForm,
    submitting,
    submitForm,
    error,
  };
};
