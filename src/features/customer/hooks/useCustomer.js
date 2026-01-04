import { useEffect, useState } from "react";
import { coreApi } from "../../../shared/services/coreApi";
import { jwtDecode } from "jwt-decode";
import { useSearchParams } from "react-router-dom";
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
  const [allCustomers, setAllCustomers] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [companyId, setCompanyId] = useState("");

  const fetchCustomers = (compId) => {
    coreApi
      .getCustomers(compId)
      .then((res) => {
        setCustomers(res.data.responseData || []);
      })
      .catch((err) => {
        console.error("Customer API error:", err);
      });
  };

  const deactivateCustomer = async (customerId) => {
    try {
      await coreApi.deactivateCustomer(companyId, customerId);
      getAllCustomers(companyId); // refresh
    } catch (err) {
      console.error("Deactivate customer error:", err);
    }
  };

  const getAllCustomers = (compId) => {
    coreApi
      .getAllCustomerByCompanyId(compId)
      .then((res) => {
        const data = res.data.responseData || [];
        setAllCustomers(data);
        setCustomers(data.filter((c) => c.isActive === true)); // default active
      })
      .catch((err) => {
        console.error("Customer API error:", err);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const compId = decode.defaultComp[0];

    setCompanyId(compId);
    getAllCustomers(compId);
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("sno", { header: "S.No" }),
    columnHelper.accessor("displayName", { header: "Display Name" }),
    columnHelper.accessor("email", { header: "Email" }),
    columnHelper.accessor("action", { header: "Action" }),
  ];

  const table = useReactTable({
    data: customers,
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
    deactivateCustomer,
    getAllCustomers,
    allCustomers,
    setCustomers,
  };
};
