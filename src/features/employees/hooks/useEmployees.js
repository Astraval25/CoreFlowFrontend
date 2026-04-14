import { useEffect, useState } from "react";
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

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [companyId, setCompanyId] = useState("");

  const fetchEmployees = (compId) => {
    coreApi
      .getEmployees(compId, false)
      .then((res) => {
        const data = res.data.responseData || [];
        setAllEmployees(data);
        setEmployees(data.filter((e) => e.isActive));
      })
      .catch((err) => console.error("Employees fetch error:", err));
  };

  const deactivateEmployee = async (employeeId) => {
    try {
      await coreApi.deactivateEmployee(companyId, employeeId);
      fetchEmployees(companyId);
    } catch (err) {
      console.error("Deactivate employee error:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const compId = decode.defaultComp[0];
    setCompanyId(compId);
    fetchEmployees(compId);
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("sno", { header: "S.No" }),
    columnHelper.accessor("employeeCode", { header: "Code" }),
    columnHelper.accessor("employeeName", { header: "Name" }),
    columnHelper.accessor("designation", { header: "Designation" }),
    columnHelper.accessor("currentSalaryType", { header: "Salary Type" }),
    columnHelper.accessor("action", { header: "Action" }),
  ];

  const table = useReactTable({
    data: employees,
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
    deactivateEmployee,
    allEmployees,
    setEmployees,
    companyId,
  };
};
