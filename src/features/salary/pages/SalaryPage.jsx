import { MdAdd, MdSearch, MdCheck, MdPayment, MdVisibility, MdDownload, MdClose, MdInbox, MdDelete } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { useSalary } from "../hooks/useSalary";

const SalaryPage = () => {
  const navigate = useNavigate();
  const {
    table, globalFilter, setGlobalFilter, loading,
    period, setPeriod, employees,
    showCalcModal, setShowCalcModal, calcForm, setCalcForm, calcLoading, calcError, calculateSalary,
    approvePeriod, deletePeriod, viewDetail, downloadSlip,
    companyId,
  } = useSalary();

  const statusBadge = (s) => {
    const map = { DRAFT: "orange", APPROVED: "blue", PAID: "blue" };
    return <span className={`badge badge-${map[s] || "gray"}`}>{s}</span>;
  };

  const formatAmount = (value) =>
    Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-sm font-bold text-app-text">Salary</h1>
          <p className="mt-0.5 text-xs text-app-sub">Calculated salary records</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={`${period.slice(0, 4)}-${period.slice(4)}`}
            onChange={(e) => setPeriod(e.target.value.replace("-", ""))}
            className="form-input text-xs py-1.5"
            aria-label="Salary month"
            style={{ width: 150 }}
          />
          <div className="relative">
            <MdSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
            <input value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search salary records..." className="form-input pl-8 text-xs py-1.5" style={{ width: 220 }} />
          </div>
          <button onClick={() => { setCalcForm({ fromDate: "", toDate: "", employeeId: "" }); setShowCalcModal(true); }} className="btn-primary text-xs">
            <MdAdd size={15} /> Run Salary
          </button>
        </div>
      </div>

      <div className="p-4 bg-surface">
        <div className="rounded-xl overflow-x-auto border border-line">
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
                <tr>
                  <td colSpan={table.getAllColumns().length} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MdInbox size={28} className="text-app-sub" />
                      <p className="text-sm text-app-sub">No salary records found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-line-soft hover:bg-surface-hover cursor-pointer" onClick={() => viewDetail(row.original.salaryPeriodId)}>
                    <td className="px-5 py-3 text-sm text-app-sub">{row.index + 1}</td>
                    <td className="px-5 py-3 text-sm font-medium text-app-text">{row.original.employeeName}</td>
                    <td className="px-5 py-3 text-sm font-medium text-brand-hover">{row.original.employeeCode}</td>
                    <td className="px-5 py-3 text-sm text-app-text">
                      <span className="whitespace-nowrap">{row.original.fromDate}</span>
                      <span className="mx-1 text-app-muted">–</span>
                      <span className="whitespace-nowrap">{row.original.toDate}</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-app-text">{row.original.salaryType}</td>
                    <td className="px-5 py-3 text-sm tabular-nums font-medium text-app-text">Rs {formatAmount(row.original.grossAmount)}</td>
                    <td className="px-5 py-3 text-sm tabular-nums font-medium text-brand-hover">Rs {formatAmount(row.original.netAmount)}</td>
                    <td className="px-5 py-3 text-sm tabular-nums font-medium text-emerald-700">Rs {formatAmount(row.original.paidAmount)}</td>
                    <td className="px-5 py-3 text-sm tabular-nums font-medium text-amber-700">Rs {formatAmount(row.original.balanceAmount)}</td>
                    <td className="px-5 py-3">{statusBadge(row.original.status)}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); viewDetail(row.original.salaryPeriodId); }} className="p-1 rounded hover:bg-gray-100" title="View Salary" aria-label={`View salary for ${row.original.employeeName}`}><MdVisibility size={16} className="text-app-sub" /></button>
                        <button onClick={(e) => { e.stopPropagation(); downloadSlip(row.original.salaryPeriodId); }} className="p-1 rounded hover:bg-gray-100" title="Download Salary Slip" aria-label={`Download salary slip for ${row.original.employeeName}`}><MdDownload size={16} className="text-app-sub" /></button>
                        {row.original.status === "DRAFT" && (
                          <>
                            <button onClick={(e) => { e.stopPropagation(); if (window.confirm("Approve this salary period?")) approvePeriod(row.original.salaryPeriodId); }} className="p-1 rounded hover:bg-blue-50" title="Approve Salary" aria-label={`Approve salary for ${row.original.employeeName}`}><MdCheck size={16} className="text-brand" /></button>
                            <button onClick={(e) => { e.stopPropagation(); if (window.confirm("Delete this draft salary record? This action cannot be undone.")) deletePeriod(row.original.salaryPeriodId); }} className="p-1 rounded hover:bg-red-50" title="Delete Draft Salary" aria-label={`Delete draft salary for ${row.original.employeeName}`}><MdDelete size={16} className="text-danger" /></button>
                          </>
                        )}
                        {row.original.status === "APPROVED" && row.original.balanceAmount > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/cf/company/${companyId}/expenses/create?salaryPeriodId=${row.original.salaryPeriodId}`);
                            }}
                            className="p-1 rounded hover:bg-blue-50"
                            title="Record Salary Payment"
                            aria-label={`Record salary payment for ${row.original.employeeName}`}
                          >
                            <MdPayment size={16} className="text-info" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          )}
        </div>
      </div>

      {showCalcModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay" onClick={() => setShowCalcModal(false)}>
          <div className="card w-full max-w-md mx-4 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-app-text">Run Salary</p>
              <button onClick={() => setShowCalcModal(false)} className="p-1 rounded hover:bg-gray-100"><MdClose size={18} /></button>
            </div>
            {calcError && <p className="text-xs mb-3 p-2 rounded text-danger bg-danger-tint">{calcError}</p>}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium mb-1 block text-app-sub">Employee (optional - leave blank for all)</label>
                <select value={calcForm.employeeId} onChange={(e) => setCalcForm((p) => ({ ...p, employeeId: e.target.value }))} className="form-input text-xs w-full">
                  <option value="">All Employees</option>
                  {employees.map((emp) => <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeName}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1 block text-app-sub">From Date</label>
                  <input type="date" value={calcForm.fromDate} onChange={(e) => setCalcForm((p) => ({ ...p, fromDate: e.target.value }))} className="form-input text-xs w-full" />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1 block text-app-sub">To Date</label>
                  <input type="date" value={calcForm.toDate} onChange={(e) => setCalcForm((p) => ({ ...p, toDate: e.target.value }))} className="form-input text-xs w-full" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowCalcModal(false)} className="btn-outline text-xs">Cancel</button>
              <button onClick={calculateSalary} disabled={calcLoading} className="btn-primary text-xs">{calcLoading ? "Running..." : "Run Salary"}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SalaryPage;
