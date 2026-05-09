import { MdAdd, MdSearch, MdCheck, MdClose } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useWorkLogs } from "../hooks/useWorkLogs";

const WorkLogsPage = () => {
  const {
    table, globalFilter, setGlobalFilter, loading,
    dateRange, setDateRange, viewMode, setViewMode,
    reviewLog, employees, workDefs,
    showModal, setShowModal, openCreate, form, setForm, submitting, submitForm, error,
  } = useWorkLogs();

  const statusBadge = (s) => {
    const map = { PENDING: "orange", APPROVED: "blue", REJECTED: "red" };
    return <span className={`badge badge-${map[s] || "gray"}`}>{s}</span>;
  };

  return (
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-app-text">Work Logs</h1>
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
            <MdSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
            <input value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." className="form-input pl-8 text-xs py-1.5" style={{ width: 180 }} />
          </div>
          <button onClick={openCreate} className="btn-primary text-xs"><MdAdd size={15} /> New</button>
        </div>
      </div>

      <div className="p-4 bg-surface">
        <div className="rounded-xl overflow-hidden border border-line">
          {loading ? (
            <p className="text-sm p-8 text-center text-app-sub">Loading...</p>
          ) : (
            <table className="w-full min-w-[980px]">
            <thead>
              <tr className="border-b border-line bg-surface-muted">
                {table.getHeaderGroups().map((hg) =>
                  hg.headers.map((header) => (
                    <th key={header.id} onClick={header.column.getToggleSortingHandler()} className="px-4 py-3 text-left cursor-pointer select-none text-[11px] font-bold uppercase tracking-[0.05em] text-app-sub">
                      <div className="flex gap-1">{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr><td colSpan={table.getAllColumns().length} className="py-16 text-center"><p className="text-sm text-app-sub">No work logs found</p></td></tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-line-soft hover:bg-surface-hover">
                    <td className="px-4 py-3 text-sm text-app-text">{row.original.logDate}</td>
                    <td className="px-4 py-3 text-sm font-medium text-app-text">{row.original.employeeName}</td>
                    <td className="px-4 py-3 text-sm text-app-text">{row.original.workName}</td>
                    <td className="px-4 py-3 text-sm tabular-nums text-app-text">{row.original.quantity}</td>
                    <td className="px-4 py-3 text-sm text-app-text">{row.original.unit}</td>
                    <td className="px-4 py-3 text-sm tabular-nums font-medium text-brand-hover">Rs {row.original.amountEarned?.toLocaleString()}</td>
                    <td className="px-4 py-3">{statusBadge(row.original.status)}</td>
                    <td className="px-4 py-3">
                      {row.original.status === "PENDING" && (
                        <div className="flex gap-1">
                          <button onClick={() => reviewLog(row.original.logId, "APPROVED")} className="p-1 rounded hover:bg-blue-50" title="Approve"><MdCheck size={16} className="text-brand" /></button>
                          <button onClick={() => reviewLog(row.original.logId, "REJECTED")} className="p-1 rounded hover:bg-red-50" title="Reject"><MdClose size={16} className="text-danger" /></button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={() => setShowModal(false)}>
          <div className="card w-full max-w-md mx-4 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-app-text">New Work Log</p>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-gray-100"><MdClose size={18} /></button>
            </div>
            {error && <p className="text-xs mb-3 p-2 rounded text-danger bg-danger-tint">{error}</p>}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block text-app-sub">Employee</label>
                <select value={form.employeeId} onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))} className="form-input text-xs w-full">
                  <option value="">Select employee</option>
                  {employees.map((emp) => <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block text-app-sub">Work Type</label>
                <select value={form.workDefId} onChange={(e) => setForm((p) => ({ ...p, workDefId: e.target.value }))} className="form-input text-xs w-full">
                  <option value="">Select work type</option>
                  {workDefs.map((wd) => <option key={wd.workDefId} value={wd.workDefId}>{wd.workName} ({wd.unit})</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block text-app-sub">Date</label>
                <input type="date" value={form.logDate} onChange={(e) => setForm((p) => ({ ...p, logDate: e.target.value }))} className="form-input text-xs w-full" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block text-app-sub">Quantity</label>
                <input type="number" step="0.01" value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} className="form-input text-xs w-full" />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block text-app-sub">Remarks</label>
                <input value={form.employeeRemarks} onChange={(e) => setForm((p) => ({ ...p, employeeRemarks: e.target.value }))} className="form-input text-xs w-full" />
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

export default WorkLogsPage;
