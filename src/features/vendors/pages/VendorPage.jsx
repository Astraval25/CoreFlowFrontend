import { MdAdd, MdChevronLeft, MdChevronRight, MdSearch } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useVendor } from "../hooks/useVendor";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ActionMenu from "../../../shared/components/ActionMenu";

const VendorPage = () => {
  const {
    table, globalFilter, setGlobalFilter,
    deactivateVendor, activateVendor,
    allVendors, setVendors,
  } = useVendor();

  const navigate = useNavigate();
  const [companyId, setCompanyId] = useState("");
  const [vendorType, setVendorType] = useState("active");
  const filteredRows = table.getRowModel().rows;
  const totalDue = filteredRows.reduce(
    (sum, row) => sum + Number(row.original?.dueAmount || 0),
    0
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setCompanyId(jwtDecode(token).defaultComp?.[0] ?? "");
  }, []);

  const handleVendorTypeChange = (e) => {
    const value = e.target.value;
    setVendorType(value);
    setVendors(allVendors.filter((v) => (value === "active" ? v.isActive : !v.isActive)));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="pt-1 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-app-text">Vendors</h1>
            <p className="text-xs mt-0.5 text-app-sub">Manage your active and archived vendors</p>
          </div>
          <select
            value={vendorType}
            onChange={handleVendorTypeChange}
            className="text-sm font-semibold px-3 py-2 rounded-lg focus:outline-none cursor-pointer border border-line bg-surface-soft text-app-heading mt-1"
          >
            <option value="active">Active Vendors</option>
            <option value="deleted">Deleted Vendors</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted"
            />
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search vendors..."
              className="form-input pl-8 text-xs py-1.5"
              style={{ width: 220 }}
            />
          </div>
          <button
            onClick={() => navigate(`/cf/company/${companyId}/vendors/create`)}
            className="btn-primary text-xs"
          >
            <MdAdd size={15} /> New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="card p-4">
          <p className="text-[11px] text-app-sub">Vendors</p>
          <p className="text-base font-extrabold text-app-text">{filteredRows.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-[11px] text-app-sub">Total Due</p>
          <p className="text-base font-extrabold text-brand">
            ₹{totalDue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="card p-4">
        <div className="rounded-xl overflow-hidden border border-line">
          <table className="w-full min-w-[780px]">
          <thead>
            <tr className="border-b border-line bg-surface-muted">
              {table.getHeaderGroups().map((hg) =>
                hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-5 py-3 text-left cursor-pointer select-none text-[11px] font-bold uppercase tracking-[0.05em] text-app-sub"
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
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="py-16 text-center">
                  <p className="text-sm text-app-sub">No vendors found</p>
                </td>
              </tr>
            ) : (
              filteredRows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-line-soft"
                  
                  onClick={() => navigate(`/cf/company/${companyId}/vendors/${row.original.vendorId}/detail`)}
                >
                  <td className="px-5 py-3 text-sm text-app-sub">{row.index + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium text-brand-hover">
                    {row.getValue("displayName")}
                  </td>
                  <td className="px-5 py-3 text-sm text-app-text">
                    {row.getValue("email") || "-"}
                  </td>
                  <td className="px-5 py-3 text-sm text-app-text">
                    {row.original.company?.vendorCompany || row.original.vendorCompany?.companyName || "-"}
                  </td>
                  <td className={`px-5 py-3 text-sm tabular-nums font-medium ${row.original.dueAmount > 0 ? "text-warning-text" : "text-app-text"}`}>
                    {row.original.dueAmount != null ? `Rs ${Number(row.original.dueAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}` : "-"}
                  </td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      row={row}
                      onEdit={() => navigate(`/cf/company/${companyId}/vendors/${row.original.vendorId}/update`)}
                      onDelete={() => { if (window.confirm("Deactivate this vendor?")) deactivateVendor(row.original.vendorId); }}
                      onActivate={() => { if (window.confirm("Activate this vendor?")) activateVendor(row.original.vendorId); }}
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
            className="p-2 rounded-lg disabled:opacity-30 text-brand-secondary"
            onMouseEnter={(e) => { if (table.getCanPreviousPage()) e.currentTarget.style.background = "var(--surface-muted)"; }}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <MdChevronLeft size={18} />
          </button>
          <span className="text-xs px-2 py-1 rounded-full font-bold bg-brand-secondary-bg text-brand-secondary">
            {table.getState().pagination.pageIndex + 1}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-lg disabled:opacity-30 text-brand-secondary"
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

export default VendorPage;
