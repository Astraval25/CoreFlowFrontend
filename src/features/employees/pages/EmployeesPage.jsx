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
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between mb-5">
        <select
          value={filter}
          onChange={handleFilterChange}
          className="text-sm font-semibold focus:outline-none bg-transparent cursor-pointer text-app-text"
        >
          <option value="active">Active Employees</option>
          <option value="inactive">Inactive Employees</option>
        </select>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
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

      <div className="p-4 bg-surface">
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
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="py-16 text-center">
                  <p className="text-sm text-app-sub">No employees found</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="cursor-pointer border-b border-line-soft"
                  
                  onClick={() => navigate(`/cf/company/${companyId}/employees/${row.original.employeeId}/detail`)}
                >
                  <td className="px-5 py-3 text-sm text-app-sub">{row.index + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium text-brand-hover">{row.original.employeeCode}</td>
                  <td className="px-5 py-3 text-sm font-medium text-app-text">{row.original.employeeName}</td>
                  <td className="px-5 py-3 text-sm text-app-text">{row.original.designation}</td>
                  <td className="px-5 py-3 text-sm text-app-text">
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
