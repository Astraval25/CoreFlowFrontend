import { MdSearch, MdVisibility, MdDownload, MdClose } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useEmployeeSalary } from "../hooks/useEmployeeSalary";

const EmployeeSalaryPage = () => {
  const {
    table, globalFilter, setGlobalFilter, loading,
    dateRange, setDateRange,
    viewDetail, downloadSlip,
    selectedDetail, setSelectedDetail, detailLoading,
  } = useEmployeeSalary();

  const statusBadge = (s) => {
    const map = { DRAFT: "orange", APPROVED: "blue", PAID: "green" };
    return <span className={`badge badge-${map[s] || "gray"}`}>{s}</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>My Salary</h1>
        <div className="flex items-center gap-3">
          <input type="date" value={dateRange.from} onChange={(e) => setDateRange((p) => ({ ...p, from: e.target.value }))} className="form-input text-xs py-1" />
          <input type="date" value={dateRange.to} onChange={(e) => setDateRange((p) => ({ ...p, to: e.target.value }))} className="form-input text-xs py-1" />
          <div className="relative">
            <MdSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <input value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search…" className="form-input pl-8 text-xs py-1.5" style={{ width: 160 }} />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="text-xs p-8 text-center" style={{ color: "var(--text-muted)" }}>Loading…</p>
        ) : (
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--surface-soft)", borderBottom: "1px solid var(--line)" }}>
                {table.getHeaderGroups().map((hg) =>
                  hg.headers.map((header) => (
                    <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="px-4 py-3 text-left cursor-pointer select-none" style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
                      <div className="flex gap-1">{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={table.getAllColumns().length} className="py-16 text-center"><p className="text-xs" style={{ color: "var(--text-muted)" }}>No salary periods found</p></td></tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: "1px solid var(--line)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-main)" }}>{row.original.periodLabel || row.original.period}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-sub)" }}>{row.original.fromDate}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-sub)" }}>{row.original.toDate}</td>
                    <td className="px-4 py-3 text-xs tabular-nums" style={{ color: "var(--text-sub)" }}>{row.original.totalWorkDays ?? row.original.workingDaysInMonth}</td>
                    <td className="px-4 py-3 text-xs tabular-nums font-semibold" style={{ color: "var(--text-main)" }}>₹{(row.original.grossSalary ?? row.original.grossAmount)?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs tabular-nums font-semibold" style={{ color: "var(--accent)" }}>₹{(row.original.netSalary ?? row.original.netAmount)?.toLocaleString()}</td>
                    <td className="px-4 py-3">{statusBadge(row.original.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => viewDetail(row.original.salaryPeriodId)} className="p-1 rounded hover:bg-gray-100" title="View Detail"><MdVisibility size={16} style={{ color: "var(--text-sub)" }} /></button>
                        <button onClick={() => downloadSlip(row.original.salaryPeriodId)} className="p-1 rounded hover:bg-gray-100" title="Download Slip"><MdDownload size={16} style={{ color: "var(--text-sub)" }} /></button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }} onClick={() => setSelectedDetail(null)}>
          <div className="card w-full max-w-lg mx-4 p-5 max-h-[80vh] overflow-y-auto thin-scroll" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>Salary Detail</p>
              <button onClick={() => setSelectedDetail(null)} className="p-1 rounded hover:bg-gray-100"><MdClose size={18} /></button>
            </div>
            {detailLoading ? (
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading…</p>
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
                      <p className="text-[10px] uppercase font-semibold" style={{ color: "var(--text-muted)" }}>{label}</p>
                      <p className="text-xs font-medium" style={{ color: "var(--text-main)" }}>{val}</p>
                    </div>
                  ))}
                </div>

                {selectedDetail.lines?.length > 0 && (
                  <>
                    <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-main)" }}>Breakdown</p>
                    <table className="w-full" style={{ borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid var(--line)" }}>
                          {["Type", "Description", "Amount"].map((h) => (
                            <th key={h} className="px-3 py-2 text-left" style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedDetail.lines.map((line) => (
                          <tr key={line.lineId} style={{ borderBottom: "1px solid var(--line)" }}>
                            <td className="px-3 py-2 text-xs"><span className={`badge badge-${line.lineType === "DEDUCTION" ? "red" : line.lineType === "FIXED" ? "blue" : "green"}`}>{line.lineType}</span></td>
                            <td className="px-3 py-2 text-xs" style={{ color: "var(--text-sub)" }}>{line.description}</td>
                            <td className="px-3 py-2 text-xs tabular-nums font-semibold" style={{ color: line.amount < 0 ? "var(--red)" : "var(--text-main)" }}>₹{line.amount?.toLocaleString()}</td>
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
