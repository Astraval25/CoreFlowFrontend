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

export const useEmployeeWorkLogs = () => {
  const [workLogs, setWorkLogs] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(getMonthRange);
  const [error, setError] = useState("");

  // For create/edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [form, setForm] = useState({
    workDefId: "",
    logDate: new Date().toISOString().split("T")[0],
    quantity: "",
    employeeRemarks: "",
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

  const fetchWorkLogs = useCallback(() => {
    setLoading(true);
    setError("");
    coreApi
      .getMyWorkLogs(dateRange.from, dateRange.to)
      .then((res) => setWorkLogs(res.data.responseData || []))
      .catch((err) => console.error("Work logs fetch error:", err))
      .finally(() => setLoading(false));
  }, [dateRange]);

  useEffect(() => {
    fetchWorkLogs();
  }, [fetchWorkLogs]);

  const openCreate = () => {
    setEditingLog(null);
    setForm({
      workDefId: "",
      logDate: new Date().toISOString().split("T")[0],
      quantity: "",
      employeeRemarks: "",
    });
    setError("");
    setShowModal(true);
  };

  const openEdit = (log) => {
    setEditingLog(log);
    setForm({
      workDefId: log.workDefId,
      logDate: log.logDate,
      quantity: log.quantity,
      employeeRemarks: log.employeeRemarks || "",
    });
    setError("");
    setShowModal(true);
  };

  const submitForm = async () => {
    if (!form.workDefId || !form.logDate || !form.quantity) {
      setError("Please fill all required fields.");
      return;
    }
    setSubmitting(true);
    setError("");
    const payload = {
      employeeId: Number(employeeId),
      workDefId: Number(form.workDefId),
      logDate: form.logDate,
      quantity: Number(form.quantity),
      employeeRemarks: form.employeeRemarks,
    };
    try {
      if (editingLog) {
        await coreApi.updateWorkLogEmployee(companyId, { ...payload, logId: editingLog.logId });
      } else {
        await coreApi.createWorkLog(companyId, payload);
      }
      setShowModal(false);
      fetchWorkLogs();
    } catch (err) {
      const msg = err.response?.data?.responseMessage || "Failed to save work log.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("logDate", { header: "Date" }),
    columnHelper.accessor("workDefName", { header: "Work Type" }),
    columnHelper.accessor("quantity", { header: "Quantity" }),
    columnHelper.accessor("employeeRemarks", { header: "Remarks" }),
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
    fetchWorkLogs,
    // Modal state
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
