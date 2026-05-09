import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useViewEmployee } from "../hooks/useViewEmployee";
import { MdArrowBack, MdEdit, MdPerson, MdKey, MdAttachMoney } from "react-icons/md";

const SALARY_TYPES = ["MONTHLY", "WORK_BASED"];

const ViewEmployeePage = () => {
  const { companyId, employeeId } = useParams();
  const navigate = useNavigate();
  const {
    employee, loading,
    portalUser, portalForm, setPortalForm, portalLoading, portalError, createPortalUser, resetPortalPassword,
    salaryForm, setSalaryForm, salaryLoading, salaryError, createSalaryConfig,
  } = useViewEmployee(employeeId);

  const [resetPwd, setResetPwd] = useState("");

  if (loading) return <p className="text-xs p-5 text-app-muted">Loading…</p>;
  if (!employee) return <p className="text-xs p-5 text-danger">Employee not found</p>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn-ghost p-1.5"><MdArrowBack size={18} /></button>
          <h1 className="text-sm font-semibold text-app-text">{employee.employeeName}</h1>
          <span className={`badge badge-${employee.isActive ? "blue" : "red"}`}>{employee.isActive ? "Active" : "Inactive"}</span>
        </div>
        <button onClick={() => navigate(`/cf/company/${companyId}/employees/${employeeId}/update`)} className="btn-outline text-xs">
          <MdEdit size={14} /> Edit
        </button>
      </div>

      {/* Info Card */}
      <div className="card p-5">
        <h2 className="text-xs font-semibold mb-3 flex items-center gap-2 text-app-text"><MdPerson size={16} /> Employee Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            ["Code", employee.employeeCode],
            ["Name", employee.employeeName],
            ["Phone", employee.phone || "—"],
            ["Email", employee.email || "—"],
            ["Designation", employee.designation || "—"],
            ["Joined", employee.joinedDt],
            ["Salary Type", employee.currentSalaryType],
            ["Monthly Amount", employee.currentMonthlyAmount != null ? `₹${employee.currentMonthlyAmount.toLocaleString()}` : "—"],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-[10px] uppercase font-semibold mb-0.5 text-app-muted">{label}</p>
              <p className="text-xs font-medium text-app-text">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Salary Config History */}
      {employee.salaryConfigHistory?.length > 0 && (
        <div className="card p-5">
          <h2 className="text-xs font-semibold mb-3 flex items-center gap-2 text-app-text"><MdAttachMoney size={16} /> Salary History</h2>
          <table className="w-full" >
            <thead>
              <tr className="border-b border-line">
                {["Type", "Amount", "From", "To"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-[10px] font-bold uppercase text-app-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employee.salaryConfigHistory.map((cfg) => (
                <tr key={cfg.configId} className="border-b border-line">
                  <td className="px-4 py-2 text-xs text-app-sub">{cfg.salaryType}</td>
                  <td className="px-4 py-2 text-xs font-semibold text-app-text">₹{cfg.monthlyAmount?.toLocaleString()}</td>
                  <td className="px-4 py-2 text-xs text-app-sub">{cfg.effectiveFrom}</td>
                  <td className="px-4 py-2 text-xs text-app-sub">{cfg.effectiveTo || "Current"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Salary Config */}
      <div className="card p-5">
        <h2 className="text-xs font-semibold mb-3 flex items-center gap-2 text-app-text"><MdAttachMoney size={16} /> Add Salary Config</h2>
        {salaryError && <p className="text-xs mb-2 text-danger">{salaryError}</p>}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Type</label>
            <select value={salaryForm.salaryType} onChange={(e) => setSalaryForm((p) => ({ ...p, salaryType: e.target.value }))} className="form-input text-xs w-full">
              {SALARY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Amount</label>
            <input type="number" value={salaryForm.monthlyAmount} onChange={(e) => setSalaryForm((p) => ({ ...p, monthlyAmount: e.target.value }))} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Effective From</label>
            <input type="date" value={salaryForm.effectiveFrom} onChange={(e) => setSalaryForm((p) => ({ ...p, effectiveFrom: e.target.value }))} className="form-input text-xs w-full" />
          </div>
        </div>
        <button onClick={createSalaryConfig} disabled={salaryLoading} className="btn-primary text-xs mt-3">
          {salaryLoading ? "Saving…" : "Add Config"}
        </button>
      </div>

      {/* Portal User */}
      <div className="card p-5">
        <h2 className="text-xs font-semibold mb-3 flex items-center gap-2 text-app-text"><MdKey size={16} /> Portal User</h2>
        {portalError && <p className="text-xs mb-2 text-danger">{portalError}</p>}

        {portalUser ? (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase font-semibold mb-0.5 text-app-muted">Username</p>
                <p className="text-xs font-medium text-app-text">{portalUser.username}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold mb-0.5 text-app-muted">Status</p>
                <span className={`badge badge-${portalUser.isActive ? "blue" : "red"}`}>{portalUser.isActive ? "Active" : "Inactive"}</span>
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold mb-0.5 text-app-muted">Last Login</p>
                <p className="text-xs text-app-sub">{portalUser.lastLoginDt || "Never"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="password"
                placeholder="New password"
                value={resetPwd}
                onChange={(e) => setResetPwd(e.target.value)}
                className="form-input text-xs"
                style={{ width: 200 }}
              />
              <button
                onClick={() => { resetPortalPassword(resetPwd); setResetPwd(""); }}
                disabled={portalLoading || !resetPwd}
                className="btn-outline text-xs"
              >
                Reset Password
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <div>
              <label className="text-xs font-medium mb-1 block text-app-sub">Username</label>
              <input value={portalForm.username} onChange={(e) => setPortalForm((p) => ({ ...p, username: e.target.value }))} className="form-input text-xs w-full" />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block text-app-sub">Password</label>
              <input type="password" value={portalForm.password} onChange={(e) => setPortalForm((p) => ({ ...p, password: e.target.value }))} className="form-input text-xs w-full" />
            </div>
            <button onClick={createPortalUser} disabled={portalLoading} className="btn-primary text-xs col-span-2 w-fit">
              {portalLoading ? "Creating…" : "Create Portal User"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEmployeePage;
