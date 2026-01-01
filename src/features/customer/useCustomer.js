import { useEffect, useState } from "react";
import { coreApi } from "../../shared/services/coreApi";
import { jwtDecode } from "jwt-decode";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const useCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    const decode = jwtDecode(token);
    const companyId = decode.defaultComp[0];

    coreApi
      .getCustomers(companyId)
      .then((res) => {
        setCustomers(res.data.responseData || []);
        // console.log(res.data.responseData)
      })
      .catch((err) => {
        console.error("Customer API error:", err);
      });
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("sno", {
      header: "S.No",
      enableSorting: true,
    }),
    columnHelper.accessor("displayName", {
      header: "Display Name",
      enableSorting: true,
    }),
    columnHelper.accessor("email", {
      header: "Email",
      enableSorting: true,
    }),
    columnHelper.accessor("action", {
      header: "Action",
      enableSorting: true,
    }),
  ];

  const table = useReactTable({
    data: customers,
    columns,
    state: {
      globalFilter,
    },
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
  };
};
