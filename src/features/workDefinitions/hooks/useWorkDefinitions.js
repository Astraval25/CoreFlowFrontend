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

export const useWorkDefinitions = () => {
  const [workDefs, setWorkDefs] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [companyId, setCompanyId] = useState("");

  const fetchWorkDefs = (compId) => {
    coreApi
      .getWorkDefinitions(compId, true)
      .then((res) => {
        setWorkDefs(res.data.responseData || []);
      })
      .catch((err) => console.error("Work defs fetch error:", err));
  };

  const deactivateWorkDef = async (workDefId) => {
    try {
      await coreApi.deactivateWorkDefinition(companyId, workDefId);
      fetchWorkDefs(companyId);
    } catch (err) {
      console.error("Deactivate work def error:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decode = jwtDecode(token);
      const compId = decode.defaultComp[0];

      setCompanyId(compId);
      fetchWorkDefs(compId);
    }
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("sno", { header: "S.No" }),
    columnHelper.accessor("workCode", { header: "Code" }),
    columnHelper.accessor("workName", { header: "Name" }),
    columnHelper.accessor("ratePerUnit", { header: "Rate/Unit" }),
    columnHelper.accessor("unit", { header: "Unit" }),
    columnHelper.accessor("action", { header: "Action" }),
  ];

  const table = useReactTable({
    data: workDefs,
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
    deactivateWorkDef,
    companyId,
  };
};