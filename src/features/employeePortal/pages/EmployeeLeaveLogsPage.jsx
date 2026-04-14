import { MdAdd, MdSearch, MdEdit, MdClose } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useEmployeeLeaveLogs } from "../hooks/useEmployeeLeaveLogs";

const LEAVE_TYPES = ["FULL_DAY", "HALF_DAY"];
const LEAVE_CATEGORIES = ["CASUAL", "SICK", "UNPAID", "LOP"];

const EmployeeLeaveLogsPage = () => {
  const {
    table, globalFilter, setGlobalFilter, loading,
    dateRange, setDateRange,
    showModal, setShowModal, editingLog, openCreate, openEdit,
    form, setForm, submitting, submitForm, error,
  } = useEmployeeLeaveLogs();

  const statusBadge = (s) => {
    const map = { PENDING: "orange", APPROVED: "green", REJECTED: "red" };
    return <span className={`badge badge-${map[s] || "gray"}`}>{s}</span>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>My Leave Logs</h1>
        <div className="flex items-center gap-3">
          <input type="date" value={dateRange.from} onChange={(e) => setDateRange((p) => ({ ...p, from: e.target.value }))} className="form-input text-xs py-1" />
          <input type="date" value={dateRange.to} onChange={(e) => setDateRange((p) => ({ ...p, to: e.target.value }))} className="form-input text-xs py-1" />
          <div className="relative">
            <MdSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
            <input value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search…" className="form-input pl-8 text-xs py-1.5" style={{ width: 160 }} />
          </div>
          <button onClick={openCreate} className="btn-primary text-xs"><MdAdd size={15} /> New</button>
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
                <tr><td colSpan={table.getAllColumns().length} className="py-16 text-center"><p className="text-xs" style={{ color: "var(--text-muted)" }}>No leave logs found</p></td></tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: "1px solid var(--line)" }} onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-sub)" }}>{row.original.leaveDate}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-sub)" }}>{row.original.leaveType?.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={`badge badge-${row.original.leaveCategory === "SICK" ? "red" : row.original.leaveCategory === "CASUAL" ? "blue" : "orange"}`}>
                        {row.original.leaveCategory}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: "var(--text-sub)" }}>{row.original.reason || "—"}</td>
                    <td className="px-4 py-3">{statusBadge(row.original.status)}</td>
                    <td className="px-4 py-3">
                      {row.original.status === "PENDING" && (
                        <button onClick={() => openEdit(row.original)} className="p-1 rounded hover:bg-gray-100" title="Edit"><MdEdit size={16} style={{ color: "var(--text-sub)" }} /></button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }} onClick={() => setShowModal(false)}>
          <div className="card w-full max-w-md mx-4 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold" style={{ color: "var(--text-main)" }}>{editingLog ? "Edit Leave" : "Apply Leave"}</p>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-gray-100"><MdClose size={18} /></button>
            </div>
            {error && <p className="text-xs mb-3 p-2 rounded" style={{ color: "var(--red)", background: "rgba(239,68,68,0.08)" }}>{error}</p>}
            <div className="space-y-3">
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
              <button onClick={submitForm} disabled={submitting} className="btn-primary text-xs">{submitting ? "Saving…" : editingLog ? "Update" : "Apply"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveLogsPage;
