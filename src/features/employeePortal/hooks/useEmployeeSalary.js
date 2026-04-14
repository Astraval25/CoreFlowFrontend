import { useEffect, useState, useCallback } from "react";
import { coreApi } from "../../../shared/services/coreApi";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const getYearRange = () => {
  const now = new Date();
  const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return {
    from: `${year}-04-01`,
    to: `${year + 1}-03-31`,
  };
};

export const useEmployeeSalary = () => {
  const [periods, setPeriods] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(getYearRange);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchPeriods = useCallback(() => {
    setLoading(true);
    coreApi
      .getMySalaryPeriods(dateRange.from, dateRange.to)
      .then((res) => setPeriods(res.data.responseData || []))
      .catch((err) => console.error("Salary periods fetch error:", err))
      .finally(() => setLoading(false));
  }, [dateRange]);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  const viewDetail = async (salaryPeriodId) => {
    setDetailLoading(true);
    try {
      const res = await coreApi.getMySalaryDetail(salaryPeriodId);
      setSelectedDetail(res.data.responseData || null);
    } catch (err) {
      console.error("Salary detail error:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const downloadSlip = async (salaryPeriodId) => {
    try {
      const res = await coreApi.downloadMySalarySlip(salaryPeriodId);
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
    columnHelper.accessor("periodLabel", { header: "Period" }),
    columnHelper.accessor("fromDate", { header: "From" }),
    columnHelper.accessor("toDate", { header: "To" }),
    columnHelper.accessor("totalWorkDays", { header: "Work Days" }),
    columnHelper.accessor("grossSalary", { header: "Gross Salary" }),
    columnHelper.accessor("netSalary", { header: "Net Salary" }),
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
    dateRange,
    setDateRange,
    fetchPeriods,
    viewDetail,
    downloadSlip,
    selectedDetail,
    setSelectedDetail,
    detailLoading,
  };
};
