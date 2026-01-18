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

export const useVendor = () => {
  const [vendors, setVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [companyId, setCompanyId] = useState("");

  const deactivateVendor = async (vendorId) => {
    try {
      await coreApi.deactivateVendor(companyId, vendorId);
      getAllVendors(companyId); // refresh
    } catch (err) {
      console.error("Deactivate vendor error:", err);
    }
  };

  const activateVendor = async (vendorId) => {
    try {
      await coreApi.activateVendor(companyId, vendorId);
      getAllVendors(companyId); // refresh
    } catch (err) {
      console.error("Activate vendor error:", err);
    }
  };

  const getAllVendors = (compId) => {
    coreApi
      .getAllVendorByCompanyId(compId)
      .then((res) => {
        const data = res.data.responseData || [];
        setAllVendors(data);
        setVendors(data.filter((c) => c.isActive === true)); // default active
      })
      .catch((err) => {
        console.error("vendor API error:", err);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const compId = decode.defaultComp[0];

    setCompanyId(compId);
    getAllVendors(compId);
  }, []);

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("sno", { header: "S.No" }),
    columnHelper.accessor("displayName", { header: "Vendor Name" }),
    columnHelper.accessor("email", { header: "Email" }),
    columnHelper.accessor("action", { header: "Action" }),
  ];

  const table = useReactTable({
    data: vendors,
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
    activateVendor,
    deactivateVendor,
    getAllVendors,
    allVendors,
    setVendors,
  };
};
