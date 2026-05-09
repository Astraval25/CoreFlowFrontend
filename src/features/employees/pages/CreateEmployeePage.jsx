import { useNavigate, useParams } from "react-router-dom";
import useCreateEmployee from "../hooks/useCreateEmployee";
import { MdArrowBack } from "react-icons/md";

const SALARY_TYPES = ["MONTHLY", "WORK_BASED"];

const CreateEmployeePage = () => {
  const navigate = useNavigate();
  const { companyId, employeeId } = useParams();
  const isEdit = !!employeeId;

  const { formData, errors, loading, handleChange, submitEmployee } = useCreateEmployee(employeeId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await submitEmployee();
    if (ok) navigate(`/cf/company/${companyId}/employees`);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="btn-ghost p-1.5">
          <MdArrowBack size={18} />
        </button>
        <h1 className="text-sm font-semibold text-app-text">
          {isEdit ? "Update Employee" : "Create Employee"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 max-w-2xl space-y-4">
        {errors.submit && (
          <p className="text-xs p-3 rounded text-danger bg-danger-tint">{errors.submit}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Employee Code <span className="text-danger">*</span></label>
            <input name="employeeCode" value={formData.employeeCode} onChange={handleChange} className="form-input text-xs w-full" disabled={isEdit} />
            {errors.employeeCode && <p className="text-xs mt-1 text-danger">{errors.employeeCode}</p>}
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Employee Name <span className="text-danger">*</span></label>
            <input name="employeeName" value={formData.employeeName} onChange={handleChange} className="form-input text-xs w-full" />
            {errors.employeeName && <p className="text-xs mt-1 text-danger">{errors.employeeName}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Phone</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Email</label>
            <input name="email" value={formData.email} onChange={handleChange} type="email" className="form-input text-xs w-full" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Designation</label>
            <input name="designation" value={formData.designation} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Joined Date <span className="text-danger">*</span></label>
            <input name="joinedDt" type="date" value={formData.joinedDt} onChange={handleChange} className="form-input text-xs w-full" />
            {errors.joinedDt && <p className="text-xs mt-1 text-danger">{errors.joinedDt}</p>}
          </div>
        </div>

        {!isEdit && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1 block text-app-sub">Salary Type</label>
              <select name="salaryType" value={formData.salaryType} onChange={handleChange} className="form-input text-xs w-full">
                {SALARY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block text-app-sub">Monthly Amount</label>
              <input name="monthlyAmount" type="number" value={formData.monthlyAmount} onChange={handleChange} className="form-input text-xs w-full" />
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-outline text-xs">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary text-xs">
            {loading ? "Saving…" : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmployeePage;
