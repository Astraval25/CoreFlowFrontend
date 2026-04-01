import { MdAdd, MdChevronLeft, MdChevronRight, MdSearch } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useCustomer } from "../hooks/useCustomer";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ActionMenu from "../../../shared/components/ActionMenu";

const CustomerPage = () => {
  const {
    table, globalFilter, setGlobalFilter,
    deactivateCustomer, activateCustomer,
    allCustomers, setCustomers,
  } = useCustomer();

  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState("");
  const [customerType, setCustomerType] = useState("active");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setCompanyId(jwtDecode(token).defaultComp?.[0] ?? "");
  }, []);

  const handleCustomerTypeChange = (e) => {
    const value = e.target.value;
    setCustomerType(value);
    setCustomers(allCustomers.filter((c) => (value === "active" ? c.isActive : !c.isActive)));
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <select
          value={customerType}
          onChange={handleCustomerTypeChange}
          className="text-sm font-semibold focus:outline-none bg-transparent cursor-pointer"
          style={{ color: "var(--text-main)" }}
        >
          <option value="active">Active Customers</option>
          <option value="deleted">Deleted Customers</option>
        </select>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search customers…"
              className="form-input pl-8 text-xs py-1.5"
              style={{ width: 220 }}
            />
          </div>
          <button
            onClick={() => navigate(`/cf/company/${companyId}/customers/create`)}
            className="btn-primary text-xs"
          >
            <MdAdd size={15} /> New
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="card overflow-hidden">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--surface-soft)", borderBottom: "1px solid var(--line)" }}>
              {table.getHeaderGroups().map((hg) =>
                hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-5 py-3 text-left cursor-pointer select-none"
                    style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}
                  >
                    <div className="flex gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="py-16 text-center">
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>No customers found</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer"
                  style={{ borderBottom: "1px solid var(--line)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() => navigate(`/cf/company/${companyId}/customers/${row.original.customerId}/detail`)}
                >
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--text-muted)" }}>{row.index + 1}</td>
                  <td className="px-5 py-3 text-xs font-semibold" style={{ color: "var(--accent)" }}>
                    {row.getValue("displayName")}
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: "var(--text-sub)" }}>
                    {row.getValue("email")}
                  </td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      row={row}
                      onEdit={() => navigate(`/cf/company/${companyId}/customers/${row.original.customerId}/update`)}
                      onDelete={() => { if (window.confirm("Deactivate this customer?")) deactivateCustomer(row.original.customerId); }}
                      onActivate={() => { if (window.confirm("Activate this customer?")) activateCustomer(row.original.customerId); }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className="flex justify-center items-center gap-4 mt-5">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="p-1.5 rounded-md disabled:opacity-30"
          style={{ color: "var(--accent)" }}
          onMouseEnter={(e) => { if (table.getCanPreviousPage()) e.currentTarget.style.background = "var(--surface-soft)"; }}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <MdChevronLeft size={18} />
        </button>
        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "var(--surface-soft)", color: "var(--accent)" }}>
          {table.getState().pagination.pageIndex + 1}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="p-1.5 rounded-md disabled:opacity-30"
          style={{ color: "var(--accent)" }}
          onMouseEnter={(e) => { if (table.getCanNextPage()) e.currentTarget.style.background = "var(--surface-soft)"; }}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <MdChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default CustomerPage;
