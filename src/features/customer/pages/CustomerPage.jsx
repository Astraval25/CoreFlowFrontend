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
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: "var(--surface-bg)", borderBottom: "1px solid var(--line)" }}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold" style={{ color: "var(--text-main)" }}>
            Customers
          </h1>
          <select
            value={customerType}
            onChange={handleCustomerTypeChange}
            className="text-sm font-semibold px-3 py-2 rounded-lg focus:outline-none cursor-pointer"
            style={{ background: "var(--surface-soft)", border: "1px solid var(--line)", color: "var(--text-heading)" }}
          >
            <option value="active">Active Customers</option>
            <option value="deleted">Deleted Customers</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-[280px]">
            <MdSearch
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search customers..."
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
              style={{ background: "var(--surface-soft)", border: "1px solid var(--line)", color: "var(--text-heading)" }}
            />
          </div>
          <button
            onClick={() => navigate(`/cf/company/${companyId}/customers/create`)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: "var(--accent)", color: "var(--surface-bg)" }}
          >
            <MdAdd size={18} />
            New
          </button>
        </div>
      </div>

      <div className="p-4" style={{ background: "var(--surface-bg)" }}>
        <div className="flex items-center gap-2 mb-3">
          {/* <h2 className="text-2xl font-semibold" style={{ color: "var(--text-main)" }}>
            {customerType === "active" ? "Active Customers" : "Deleted Customers"}
          </h2>
          <span
            className="text-xs px-2 py-1 rounded-full font-bold"
            style={{ background: "var(--accent-secondary-bg)", color: "var(--accent-secondary)" }}
          >
            {table.getRowModel().rows.length}
          </span> */}
        </div>

        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--line)" }}>
          <table className="w-full min-w-[780px]">
            <thead>
              <tr style={{ background: "var(--surface-muted)", borderBottom: "1px solid var(--line)" }}>
                {table.getHeaderGroups().map((hg) =>
                  hg.headers.map((header) => (
                    <th
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      className="px-5 py-3 text-left cursor-pointer select-none"
                      style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-sub)" }}
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
                    <p className="text-sm" style={{ color: "var(--text-sub)" }}>No customers found</p>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="cursor-pointer"
                    style={{ borderBottom: "1px solid var(--line-soft)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--surface-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--surface-bg)";
                    }}
                    onClick={() => navigate(`/cf/company/${companyId}/customers/${row.original.customerId}/detail`)}
                  >
                    <td className="px-5 py-3 text-sm" style={{ color: "var(--text-sub)" }}>
                      {row.index + 1}
                    </td>
                    <td className="px-5 py-3 text-sm font-medium" style={{ color: "var(--accent-hover)" }}>
                      {row.getValue("displayName")}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "var(--text-main)" }}>
                      {row.getValue("email") || "-"}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "var(--text-main)" }}>
                      {row.original.company?.customerCompany || row.original.customerCompany?.companyName || "-"}
                    </td>
                    <td
                      className="px-5 py-3 text-sm tabular-nums font-medium"
                      style={{ color: row.original.dueAmount > 0 ? "var(--orange-text)" : "var(--text-main)" }}
                    >
                      {row.original.dueAmount != null
                        ? `Rs ${Number(row.original.dueAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                        : "-"}
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

        <div className="flex justify-center items-center gap-4 mt-5">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-lg disabled:opacity-30"
            style={{ color: "var(--accent-secondary)" }}
            onMouseEnter={(e) => { if (table.getCanPreviousPage()) e.currentTarget.style.background = "var(--surface-muted)"; }}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <MdChevronLeft size={18} />
          </button>
          <span
            className="text-xs px-2 py-1 rounded-full font-bold"
            style={{ background: "var(--accent-secondary-bg)", color: "var(--accent-secondary)" }}
          >
            {table.getState().pagination.pageIndex + 1}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg disabled:opacity-30"
            style={{ color: "var(--accent-secondary)" }}
            onMouseEnter={(e) => { if (table.getCanNextPage()) e.currentTarget.style.background = "var(--surface-muted)"; }}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <MdChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
