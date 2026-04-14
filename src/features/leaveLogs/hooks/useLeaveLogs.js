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

export const useLeaveLogs = () => {
  const [leaveLogs, setLeaveLogs] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(getMonthRange);
  const [viewMode, setViewMode] = useState("all");
  const [employees, setEmployees] = useState([]);

  // Create modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    employeeId: "",
    leaveDate: new Date().toISOString().split("T")[0],
    leaveType: "FULL_DAY",
    leaveCategory: "CASUAL",
    reason: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const compId = decode.defaultComp[0];
    setCompanyId(compId);

    coreApi.getEmployees(compId, true)
      .then((res) => setEmployees(res.data.responseData || []))
      .catch(() => {});
  }, []);

  const fetchLeaveLogs = useCallback(() => {
    if (!companyId) return;
    setLoading(true);
    const promise = viewMode === "pending"
      ? coreApi.getPendingLeaveLogs(companyId)
      : coreApi.getLeaveLogs(companyId, dateRange.from, dateRange.to);
    promise
      .then((res) => setLeaveLogs(res.data.responseData || []))
      .catch((err) => console.error("Leave logs error:", err))
      .finally(() => setLoading(false));
  }, [companyId, dateRange, viewMode]);

  useEffect(() => {
    fetchLeaveLogs();
  }, [fetchLeaveLogs]);

  const reviewLog = async (leaveId, status) => {
    try {
      await coreApi.reviewLeaveLog(companyId, leaveId, { status });
      fetchLeaveLogs();
    } catch (err) {
      console.error("Review leave error:", err);
    }
  };

  const openCreate = () => {
    setForm({
      employeeId: "",
      leaveDate: new Date().toISOString().split("T")[0],
      leaveType: "FULL_DAY",
      leaveCategory: "CASUAL",
      reason: "",
    });
    setError("");
    setShowModal(true);
  };

  const submitForm = async () => {
    if (!form.employeeId || !form.leaveDate) {
      setError("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await coreApi.createLeaveLog(companyId, {
        employeeId: Number(form.employeeId),
        leaveDate: form.leaveDate,
        leaveType: form.leaveType,
        leaveCategory: form.leaveCategory,
        reason: form.reason,
      });
      setShowModal(false);
      fetchLeaveLogs();
    } catch (err) {
      setError(err.response?.data?.responseMessage || "Failed to create leave log.");
    } finally {
      setSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("leaveDate", { header: "Date" }),
    columnHelper.accessor("employeeName", { header: "Employee" }),
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
    viewMode,
    setViewMode,
    reviewLog,
    employees,
    showModal,
    setShowModal,
    openCreate,
    form,
    setForm,
    submitting,
    submitForm,
    error,
    companyId,
  };
};
