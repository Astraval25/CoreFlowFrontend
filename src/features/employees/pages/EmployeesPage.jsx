import { useState } from "react";
import { MdAdd, MdSearch } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { useEmployees } from "../hooks/useEmployees";
import ActionMenu from "../../../shared/components/ActionMenu";

const EmployeesPage = () => {
  const {
    table, globalFilter, setGlobalFilter,
    deactivateEmployee, allEmployees, setEmployees, companyId,
  } = useEmployees();

  const navigate = useNavigate();
  const [filter, setFilter] = useState("active");

  const handleFilterChange = (e) => {
    const val = e.target.value;
    setFilter(val);
    setEmployees(allEmployees.filter((emp) => (val === "active" ? emp.isActive : !emp.isActive)));
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div className="flex items-center justify-between mb-5">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="text-sm font-semibold focus:outline-none bg-transparent cursor-pointer"
          style={{ color: "var(--text-main)" }}
        >
          <option value="active">Active Employees</option>
          <option value="inactive">Inactive Employees</option>
        </select>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search employees..."
              className="form-input pl-8 text-xs py-1.5"
              style={{ width: 220 }}
            />
          </div>
          <button onClick={() => navigate(`/cf/company/${companyId}/employees/create`)} className="btn-primary text-xs">
            <MdAdd size={15} /> New
          </button>
        </div>
      </div>

      <div className="p-4" style={{ background: "var(--surface-bg)" }}>
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
                  <p className="text-sm" style={{ color: "var(--text-sub)" }}>No employees found</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer"
                  style={{ borderBottom: "1px solid var(--line-soft)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-bg)")}
                  onClick={() => navigate(`/cf/company/${companyId}/employees/${row.original.employeeId}/detail`)}
                >
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--text-sub)" }}>{row.index + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium" style={{ color: "var(--accent-hover)" }}>{row.original.employeeCode}</td>
                  <td className="px-5 py-3 text-sm font-medium" style={{ color: "var(--text-main)" }}>{row.original.employeeName}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--text-main)" }}>{row.original.designation}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--text-main)" }}>
                    <span className={`badge badge-${row.original.currentSalaryType === "MONTHLY" ? "blue" : "orange"}`}>
                      {row.original.currentSalaryType}
                    </span>
                  </td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      row={row}
                      onEdit={() => navigate(`/cf/company/${companyId}/employees/${row.original.employeeId}/update`)}
                      onDelete={async () => {
                        if (window.confirm("Deactivate this employee?")) {
                          await deactivateEmployee(row.original.employeeId);
                        }
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeesPage;
