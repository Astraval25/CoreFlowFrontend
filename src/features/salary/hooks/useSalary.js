import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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

const getCurrentPeriod = () => {
  const now = new Date();
  return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export const useSalary = () => {
  const navigate = useNavigate();
  const [periods, setPeriods] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(getCurrentPeriod);
  const [employees, setEmployees] = useState([]);

  // Calculate modal
  const [showCalcModal, setShowCalcModal] = useState(false);
  const [calcForm, setCalcForm] = useState({
    fromDate: "",
    toDate: "",
    employeeId: "",
  });
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const compId = decode.defaultComp[0];
    setCompanyId(compId);

    coreApi.getEmployees(compId, true)
      .then((res) => setEmployees(res.data.responseData || []))
      .catch(() => {});
  }, []);

  const fetchPeriods = useCallback(() => {
    if (!companyId) return;
    setLoading(true);
    coreApi
      .getSalaryPeriods(companyId, period)
      .then((res) => setPeriods(res.data.responseData || []))
      .catch((err) => console.error("Salary periods error:", err))
      .finally(() => setLoading(false));
  }, [companyId, period]);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  const calculateSalary = async () => {
    if (!calcForm.fromDate || !calcForm.toDate) {
      setCalcError("From and To dates are required.");
      return;
    }
    setCalcLoading(true);
    setCalcError("");
    try {
      await coreApi.calculateSalary(companyId, {
        fromDate: calcForm.fromDate,
        toDate: calcForm.toDate,
        employeeId: calcForm.employeeId ? Number(calcForm.employeeId) : undefined,
      });
      setShowCalcModal(false);
      fetchPeriods();
    } catch (err) {
      setCalcError(err.response?.data?.responseMessage || "Failed to calculate salary.");
    } finally {
      setCalcLoading(false);
    }
  };

  const approvePeriod = async (salaryPeriodId) => {
    try {
      await coreApi.approveSalaryPeriod(companyId, salaryPeriodId);
      fetchPeriods();
    } catch (err) {
      console.error("Approve error:", err);
    }
  };

  const viewDetail = (salaryPeriodId) => {
    navigate(`/cf/company/${companyId}/salary/${salaryPeriodId}`);
  };

  const downloadSlip = async (salaryPeriodId) => {
    try {
      const res = await coreApi.downloadSalarySlip(companyId, salaryPeriodId);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `salary-slip-${salaryPeriodId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download slip error:", err);
    }
  };

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("employeeName", { header: "Employee" }),
    columnHelper.accessor("employeeCode", { header: "Code" }),
    columnHelper.accessor("fromDate", { header: "From" }),
    columnHelper.accessor("toDate", { header: "To" }),
    columnHelper.accessor("salaryType", { header: "Type" }),
    columnHelper.accessor("grossAmount", { header: "Gross" }),
    columnHelper.accessor("netAmount", { header: "Net" }),
    columnHelper.accessor("paidAmount", { header: "Paid" }),
    columnHelper.accessor("balanceAmount", { header: "Balance" }),
    columnHelper.accessor("status", { header: "Status" }),
    columnHelper.accessor("_actions", { header: "Actions" }),
  ];

  const table = useReactTable({
    data: periods,
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
    period,
    setPeriod,
    employees,
    showCalcModal,
    setShowCalcModal,
    calcForm,
    setCalcForm,
    calcLoading,
    calcError,
    calculateSalary,
    approvePeriod,
    viewDetail,
    downloadSlip,
    companyId,
  };
};
