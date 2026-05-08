import { MdAdd, MdSearch, MdCheck, MdClose } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useLeaveLogs } from "../hooks/useLeaveLogs";

const LEAVE_TYPES = ["FULL_DAY", "HALF_DAY"];
const LEAVE_CATEGORIES = ["CASUAL", "SICK", "UNPAID", "LOP"];

const LeaveLogsPage = () => {
  const {
    table, globalFilter, setGlobalFilter, loading,
    dateRange, setDateRange, viewMode, setViewMode,
    reviewLog, employees,
    showModal, setShowModal, openCreate, form, setForm, submitting, submitForm, error,
  } = useLeaveLogs();

  const statusBadge = (s) => {
    const map = { PENDING: "orange", APPROVED: "blue", REJECTED: "red" };
    return <span className={`badge badge-${map[s] || "gray"}`}>{s}</span>;
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>Leave Logs</h1>
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value)} className="form-input text-xs py-1">
            <option value="all">All</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          {viewMode === "all" && (
            <>
              <input type="date" value={dateRange.from} onChange={(e) => setDateRange((p) => ({ ...p, from: e.target.value }))} className="form-input text-xs py-1" />
              <input type="date" value={dateRange.to} onChange={(e) => setDateRange((p) => ({ ...p, to: e.target.value }))} className="form-input text-xs py-1" />
            </>
          )}
          <div className="relative">
            <MdSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <input value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." className="form-input pl-8 text-xs py-1.5" style={{ width: 180 }} />
          </div>
          <button onClick={openCreate} className="btn-primary text-xs"><MdAdd size={15} /> New</button>
        </div>
      </div>

      <div className="p-4" style={{ background: "var(--surface-bg)" }}>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--line)" }}>
          {loading ? (
            <p className="text-sm p-8 text-center" style={{ color: "var(--text-sub)" }}>Loading...</p>
          ) : (
            <table className="w-full min-w-[980px]">
            <thead>
              <tr style={{ background: "var(--surface-muted)", borderBottom: "1px solid var(--line)" }}>
                {table.getHeaderGroups().map((hg) =>
                  hg.headers.map((header) => (
                    <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="px-4 py-3 text-left cursor-pointer select-none" style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-sub)" }}>
                      <div className="flex gap-1">{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={table.getAllColumns().length} className="py-16 text-center"><p className="text-sm" style={{ color: "var(--text-sub)" }}>No leave logs found</p></td></tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: "1px solid var(--line-soft)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")} onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-bg)")}>
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--text-main)" }}>{row.original.leaveDate}</td>
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: "var(--text-main)" }}>{row.original.employeeName}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--text-main)" }}>{row.original.leaveType}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--text-main)" }}>
                      <span className={`badge badge-${row.original.leaveCategory === "SICK" ? "red" : row.original.leaveCategory === "CASUAL" ? "blue" : "orange"}`}>
                        {row.original.leaveCategory}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--text-main)" }}>{row.original.reason || "-"}</td>
                    <td className="px-4 py-3">{statusBadge(row.original.status)}</td>
                    <td className="px-4 py-3">
                      {row.original.status === "PENDING" && (
                        <div className="flex gap-1">
                          <button onClick={() => reviewLog(row.original.leaveId, "APPROVED")} className="p-1 rounded hover:bg-blue-50" title="Approve"><MdCheck size={16} style={{ color: "var(--accent)" }} /></button>
                          <button onClick={() => reviewLog(row.original.leaveId, "REJECTED")} className="p-1 rounded hover:bg-red-50" title="Reject"><MdClose size={16} style={{ color: "var(--red)" }} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "var(--overlay-bg)" }} onClick={() => setShowModal(false)}>
          <div className="card w-full max-w-md mx-4 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>New Leave Log</p>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-gray-100"><MdClose size={18} /></button>
            </div>
            {error && <p className="text-xs mb-3 p-2 rounded" style={{ color: "var(--red)", background: "var(--red-tint)" }}>{error}</p>}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-sub)" }}>Employee</label>
                <select value={form.employeeId} onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))} className="form-input text-xs w-full">
                  <option value="">Select employee</option>
                  {employees.map((emp) => <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-sub)" }}>Leave Date</label>
                <input type="date" value={form.leaveDate} onChange={(e) => setForm((p) => ({ ...p, leaveDate: e.target.value }))} className="form-input text-xs w-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-sub)" }}>Type</label>
                  <select value={form.leaveType} onChange={(e) => setForm((p) => ({ ...p, leaveType: e.target.value }))} className="form-input text-xs w-full">
                    {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-sub)" }}>Category</label>
                  <select value={form.leaveCategory} onChange={(e) => setForm((p) => ({ ...p, leaveCategory: e.target.value }))} className="form-input text-xs w-full">
                    {LEAVE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: "var(--text-sub)" }}>Reason</label>
                <input value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} className="form-input text-xs w-full" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowModal(false)} className="btn-outline text-xs">Cancel</button>
              <button onClick={submitForm} disabled={submitting} className="btn-primary text-xs">{submitting ? "Saving..." : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveLogsPage;
