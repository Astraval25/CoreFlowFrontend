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

export const useWorkLogs = () => {
  const [workLogs, setWorkLogs] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(getMonthRange);
  const [viewMode, setViewMode] = useState("all"); // all | pending
  const [employees, setEmployees] = useState([]);
  const [workDefs, setWorkDefs] = useState([]);

  // Create modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    employeeId: "",
    workDefId: "",
    logDate: new Date().toISOString().split("T")[0],
    quantity: "",
    employeeRemarks: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingLogId, setEditingLogId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const compId = decode.defaultComp[0];
    setCompanyId(compId);

    coreApi.getEmployees(compId, true)
      .then((res) => setEmployees(res.data.responseData || []))
      .catch(() => {});
    coreApi.getWorkDefinitions(compId, true)
      .then((res) => setWorkDefs(res.data.responseData || []))
      .catch(() => {});
  }, []);

  const fetchWorkLogs = useCallback(() => {
    if (!companyId) return;
    setLoading(true);
    const promise = viewMode === "pending"
      ? coreApi.getPendingWorkLogs(companyId)
      : coreApi.getWorkLogs(companyId, dateRange.from, dateRange.to);
    promise
      .then((res) => setWorkLogs(res.data.responseData || []))
      .catch((err) => console.error("Work logs error:", err))
      .finally(() => setLoading(false));
  }, [companyId, dateRange, viewMode]);

  useEffect(() => {
    fetchWorkLogs();
  }, [fetchWorkLogs]);

  const reviewLog = async (logId, status, adminRemarks = "") => {
    try {
      await coreApi.reviewWorkLog(companyId, logId, { status, adminRemarks });
      fetchWorkLogs();
    } catch (err) {
      console.error("Review error:", err);
    }
  };

  const openCreate = () => {
    setEditingLogId(null);
    setForm({
      employeeId: "",
      workDefId: "",
      logDate: new Date().toISOString().split("T")[0],
      quantity: "",
      employeeRemarks: "",
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (log) => {
    setEditingLogId(log.logId);
    setForm({
      employeeId: String(log.employeeId),
      workDefId: String(log.workDefId),
      logDate: log.logDate,
      quantity: log.quantity,
      employeeRemarks: log.employeeRemarks || "",
    });
    setError("");
    setShowModal(true);
  };

  const submitForm = async () => {
    if (!form.employeeId || !form.workDefId || !form.logDate || !form.quantity) {
      setError("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        employeeId: Number(form.employeeId),
        workDefId: Number(form.workDefId),
        logDate: form.logDate,
        quantity: Number(form.quantity),
        employeeRemarks: form.employeeRemarks,
      };
      if (editingLogId) {
        await coreApi.updateWorkLogByAdmin(companyId, editingLogId, payload);
      } else {
        await coreApi.createWorkLog(companyId, payload);
      }
      setShowModal(false);
      fetchWorkLogs();
    } catch (err) {
      setError(
        err.response?.data?.responseMessage ||
        `Failed to ${editingLogId ? "update" : "create"} work log.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const deleteLog = async (logId) => {
    try {
      await coreApi.deleteWorkLog(companyId, logId);
      fetchWorkLogs();
    } catch (err) {
      window.alert(err.response?.data?.responseMessage || "Failed to delete work log.");
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("logDate", { header: "Date" }),
    columnHelper.accessor("employeeName", { header: "Employee" }),
    columnHelper.accessor("workName", { header: "Work Type" }),
    columnHelper.accessor("quantity", { header: "Qty" }),
    columnHelper.accessor("unit", { header: "Unit" }),
    columnHelper.accessor("amountEarned", { header: "Amount" }),
    columnHelper.accessor("status", { header: "Status" }),
    columnHelper.accessor("_actions", { header: "Action" }),
  ];

  const table = useReactTable({
    data: workLogs,
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
    workDefs,
    showModal,
    setShowModal,
    openCreate,
    openEdit,
    form,
    setForm,
    submitting,
    submitForm,
    error,
    editingLogId,
    deleteLog,
    companyId,
  };
};
