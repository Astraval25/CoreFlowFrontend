import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import useCreateExpenseAccount from "../hooks/useCreateExpenseAccount";

const CreateExpenseAccountPage = () => {
  const navigate = useNavigate();
  const { companyId, expenseAccountId } = useParams();
  const isEdit = Boolean(expenseAccountId);
  const {
    accountTypes,
    formData,
    errors,
    loading,
    handleChange,
    submitAccount,
  } = useCreateExpenseAccount(expenseAccountId);

  const listPath = `/cf/company/${companyId}/setup/expense-accounts`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await submitAccount();
    if (ok) navigate(listPath);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button type="button" onClick={() => navigate(listPath)} className="btn-ghost p-1.5">
          <MdArrowBack size={18} />
        </button>
        <h1 className="text-sm font-semibold text-app-text">
          {isEdit ? "Update Expense Account" : "Create Expense Account"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 max-w-2xl space-y-4">
        {errors.submit && <p className="text-xs p-3 rounded text-danger bg-danger-tint">{errors.submit}</p>}

        <div>
          <label className="text-xs font-medium mb-1 block text-app-sub">
            Account Type <span className="text-danger">*</span>
          </label>
          <select
            name="accountType"
            value={formData.accountType}
            onChange={handleChange}
            className={`form-input text-xs w-full ${errors.accountType ? "border-danger" : ""}`}
          >
            {accountTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.accountType && <p className="text-xs mt-1 text-danger">{errors.accountType}</p>}
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block text-app-sub">
            Account Name <span className="text-danger">*</span>
          </label>
          <input
            name="accountName"
            value={formData.accountName}
            onChange={handleChange}
            className={`form-input text-xs w-full ${errors.accountName ? "border-danger" : ""}`}
            placeholder="Account name"
          />
          {errors.accountName && <p className="text-xs mt-1 text-danger">{errors.accountName}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(listPath)} className="btn-outline text-xs">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary text-xs">
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExpenseAccountPage;
