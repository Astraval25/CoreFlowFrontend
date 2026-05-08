import { MdSearch, MdVisibility, MdDownload, MdClose } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useEmployeeSalary } from "../hooks/useEmployeeSalary";

const EmployeeSalaryPage = () => {
  const {
    table, globalFilter, setGlobalFilter, loading,
    period, setPeriod,
    viewDetail, downloadSlip,
    selectedDetail, setSelectedDetail, detailLoading,
  } = useEmployeeSalary();

  const statusBadge = (s) => {
    const map = { DRAFT: "orange", APPROVED: "blue", PAID: "blue" };
    return <span className={`badge badge-${map[s] || "gray"}`}>{s}</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-sm font-semibold text-app-text">My Salary</h1>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={`${period.slice(0, 4)}-${period.slice(4)}`}
            onChange={(e) => setPeriod(e.target.value.replace("-", ""))}
            className="form-input text-xs py-1"
          />
          <div className="relative">
            <MdSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
            <input value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search…" className="form-input pl-8 text-xs py-1.5" style={{ width: 160 }} />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="text-xs p-8 text-center text-app-muted">Loading…</p>
        ) : (
          <table className="w-full" >
            <thead>
              <tr className="border-b border-line bg-surface-soft">
                {table.getHeaderGroups().map((hg) =>
                  hg.headers.map((header) => (
                    <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="px-4 py-3 text-left cursor-pointer select-none text-[10px] font-bold uppercase tracking-[0.05em] text-app-muted">
                      <div className="flex gap-1">{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={table.getAllColumns().length} className="py-16 text-center"><p className="text-xs text-app-muted">No salary periods found</p></td></tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-line" onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td className="px-4 py-3 text-xs text-app-text">{row.original.periodLabel || row.original.period}</td>
                    <td className="px-4 py-3 text-xs text-app-sub">{row.original.fromDate}</td>
                    <td className="px-4 py-3 text-xs text-app-sub">{row.original.toDate}</td>
                    <td className="px-4 py-3 text-xs tabular-nums text-app-sub">{row.original.totalWorkDays ?? row.original.workingDaysInMonth}</td>
                    <td className="px-4 py-3 text-xs tabular-nums font-semibold text-app-text">₹{(row.original.grossSalary ?? row.original.grossAmount)?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs tabular-nums font-semibold text-brand">₹{(row.original.netSalary ?? row.original.netAmount)?.toLocaleString()}</td>
                    <td className="px-4 py-3">{statusBadge(row.original.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => viewDetail(row.original.salaryPeriodId)} className="p-1 rounded hover:bg-gray-100" title="View Detail"><MdVisibility size={16} className="text-app-sub" /></button>
                        <button onClick={() => downloadSlip(row.original.salaryPeriodId)} className="p-1 rounded hover:bg-gray-100" title="Download Slip"><MdDownload size={16} className="text-app-sub" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={() => setSelectedDetail(null)}>
          <div className="card w-full max-w-lg mx-4 p-5 max-h-[80vh] overflow-y-auto thin-scroll" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-app-text">Salary Detail</p>
              <button onClick={() => setSelectedDetail(null)} className="p-1 rounded hover:bg-gray-100"><MdClose size={18} /></button>
            </div>
            {detailLoading ? (
              <p className="text-xs text-app-muted">Loading…</p>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    ["Period", `${selectedDetail.fromDate} to ${selectedDetail.toDate}`],
                    ["Type", selectedDetail.salaryType],
                    ["Working Days", selectedDetail.workingDaysInMonth],
                    ["Days Present", selectedDetail.daysPresent],
                    ["Days Absent", selectedDetail.daysAbsent],
                    ["LOP Days", selectedDetail.lopDays],
                    ["Gross", `₹${selectedDetail.grossAmount?.toLocaleString()}`],
                    ["Net Amount", `₹${selectedDetail.netAmount?.toLocaleString()}`],
                    ["Status", selectedDetail.status],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="text-[10px] uppercase font-semibold text-app-muted">{label}</p>
                      <p className="text-xs font-medium text-app-text">{val}</p>
                    </div>
                  ))}
                </div>

                {selectedDetail.lines?.length > 0 && (
                  <>
                    <p className="text-xs font-semibold mb-2 text-app-text">Breakdown</p>
                    <table className="w-full" >
                      <thead>
                        <tr className="border-b border-line">
                          {["Type", "Description", "Amount"].map((h) => (
                            <th key={h} className="px-3 py-2 text-left text-[10px] font-bold uppercase text-app-muted">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDetail.lines.map((line) => (
                          <tr key={line.lineId} className="border-b border-line">
                            <td className="px-3 py-2 text-xs"><span className={`badge badge-${line.lineType === "DEDUCTION" ? "red" : line.lineType === "FIXED" ? "blue" : "blue"}`}>{line.lineType}</span></td>
                            <td className="px-3 py-2 text-xs text-app-sub">{line.description}</td>
                            <td className={`px-3 py-2 text-xs tabular-nums font-semibold ${line.amount < 0 ? "text-danger" : "text-app-text"}`}>₹{line.amount?.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeSalaryPage;
