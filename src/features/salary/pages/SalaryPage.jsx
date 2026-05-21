import { MdAdd, MdSearch, MdCheck, MdPayment, MdVisibility, MdDownload, MdClose } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { useSalary } from "../hooks/useSalary";

const SalaryPage = () => {
  const navigate = useNavigate();
  const {
    table, globalFilter, setGlobalFilter, loading,
    period, setPeriod, employees,
    showCalcModal, setShowCalcModal, calcForm, setCalcForm, calcLoading, calcError, calculateSalary,
    approvePeriod, viewDetail, downloadSlip,
    companyId,
  } = useSalary();

  const statusBadge = (s) => {
    const map = { DRAFT: "orange", APPROVED: "blue", PAID: "blue" };
    return <span className={`badge badge-${map[s] || "gray"}`}>{s}</span>;
  };

  return (
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-semibold text-app-text">Salary</h1>
          <input
            type="month"
            value={`${period.slice(0, 4)}-${period.slice(4)}`}
            onChange={(e) => setPeriod(e.target.value.replace("-", ""))}
            className="form-input text-xs py-1"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted" />
            <input value={globalFilter ?? ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." className="form-input pl-8 text-xs py-1.5" style={{ width: 180 }} />
          </div>
          <button onClick={() => { setCalcForm({ fromDate: "", toDate: "", employeeId: "" }); setShowCalcModal(true); }} className="btn-primary text-xs">
            <MdAdd size={15} /> Calculate
          </button>
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
                <tr><td colSpan={table.getAllColumns().length} className="py-16 text-center"><p className="text-sm text-app-sub">No salary periods found</p></td></tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-line-soft hover:bg-surface-hover cursor-pointer" onClick={() => viewDetail(row.original.salaryPeriodId)}>
                    <td className="px-4 py-3 text-sm font-medium text-app-text">{row.original.employeeName}</td>
                    <td className="px-4 py-3 text-sm text-brand-hover">{row.original.employeeCode}</td>
                    <td className="px-4 py-3 text-sm text-app-text">{row.original.fromDate}</td>
                    <td className="px-4 py-3 text-sm text-app-text">{row.original.toDate}</td>
                    <td className="px-4 py-3 text-sm text-app-text">{row.original.salaryType}</td>
                    <td className="px-4 py-3 text-sm tabular-nums font-medium text-app-text">Rs {row.original.grossAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm tabular-nums font-medium text-brand-hover">Rs {row.original.netAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm tabular-nums font-medium text-emerald-700">Rs {row.original.paidAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm tabular-nums font-medium text-amber-700">Rs {row.original.balanceAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3">{statusBadge(row.original.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={(e) => { e.stopPropagation(); viewDetail(row.original.salaryPeriodId); }} className="p-1 rounded hover:bg-gray-100" title="View Detail"><MdVisibility size={16} className="text-app-sub" /></button>
                        <button onClick={(e) => { e.stopPropagation(); downloadSlip(row.original.salaryPeriodId); }} className="p-1 rounded hover:bg-gray-100" title="Download Slip"><MdDownload size={16} className="text-app-sub" /></button>
                        {row.original.status === "DRAFT" && (
                          <button onClick={(e) => { e.stopPropagation(); if (window.confirm("Approve this salary period?")) approvePeriod(row.original.salaryPeriodId); }} className="p-1 rounded hover:bg-blue-50" title="Approve"><MdCheck size={16} className="text-brand" /></button>
                        )}
                        {row.original.status === "APPROVED" && row.original.balanceAmount > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/cf/company/${companyId}/expenses/create?salaryPeriodId=${row.original.salaryPeriodId}`);
                            }}
                            className="p-1 rounded hover:bg-blue-50"
                            title="Record Salary Payment"
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
              <p className="text-sm font-semibold text-app-text">Calculate Salary</p>
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
              <button onClick={calculateSalary} disabled={calcLoading} className="btn-primary text-xs">{calcLoading ? "Calculating..." : "Calculate"}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SalaryPage;
