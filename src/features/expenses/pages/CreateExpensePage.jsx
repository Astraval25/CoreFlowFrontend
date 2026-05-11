import { MdArrowBack, MdSettings } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import useCreateExpense from "../hooks/useCreateExpense";

const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-semibold uppercase tracking-wide text-app-muted">
      {label}
      {required && <span className="text-danger"> *</span>}
    </label>
    {children}
    {error && <span className="text-[11px] text-danger">{error}</span>}
  </div>
);

const CreateExpensePage = () => {
  const navigate = useNavigate();
  const { companyId, expenseId } = useParams();
  const isEdit = Boolean(expenseId);
  const {
    expenseAccounts,
    vendors,
    customers,
    paymentModes,
    formData,
    errors,
    loading,
    handleChange,
    submitExpense,
  } = useCreateExpense(expenseId);

  const listPath = `/cf/company/${companyId}/expenses/list`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await submitExpense();
    if (ok) navigate(listPath);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(listPath)} className="btn-ghost p-1.5">
            <MdArrowBack size={18} />
          </button>
          <h1 className="text-sm font-semibold text-app-text">
            {isEdit ? "Update Expense" : "Create Expense"}
          </h1>
        </div>
        <button
          type="button"
          className="btn-ghost text-xs"
          onClick={() => navigate(`/cf/company/${companyId}/setup/expense-accounts`)}
        >
          <MdSettings size={14} /> Expense Accounts
        </button>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {errors.submit && <p className="text-xs p-3 rounded text-danger bg-danger-tint">{errors.submit}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Date" required error={errors.expenseDate}>
            <input
              type="date"
              name="expenseDate"
              value={formData.expenseDate}
              onChange={handleChange}
              className={`form-input ${errors.expenseDate ? "border-danger" : ""}`}
            />
          </Field>

          <Field label="Payment Mode" required error={errors.paymentMode}>
            <select
              name="paymentMode"
              value={formData.paymentMode}
              onChange={handleChange}
              className={`form-input ${errors.paymentMode ? "border-danger" : ""}`}
            >
              {paymentModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Amount" required error={errors.amount}>
            <input
              type="number"
              step="0.01"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`form-input ${errors.amount ? "border-danger" : ""}`}
              placeholder="0.00"
            />
          </Field>

          <Field label="Expense Account" required error={errors.expenseAccountId}>
            <select
              name="expenseAccountId"
              value={formData.expenseAccountId}
              onChange={handleChange}
              className={`form-input ${errors.expenseAccountId ? "border-danger" : ""}`}
            >
              <option value="">Select account</option>
              {expenseAccounts.map((account) => (
                <option key={account.expenseAccountId} value={account.expenseAccountId}>
                  {account.accountName} - {account.accountType}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Invoice No">
            <input
              type="text"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleChange}
              className="form-input"
              placeholder="Invoice number"
            />
          </Field>

          <Field label="Vendor">
            <select
              name="vendorId"
              value={formData.vendorId}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select vendor</option>
              {vendors.map((vendor) => (
                <option key={vendor.vendorId} value={vendor.vendorId}>
                  {vendor.displayName || vendor.vendorName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Customer">
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleChange}
              className="form-input"
            >
              <option value="">Select customer</option>
              {customers.map((customer) => (
                <option key={customer.customerId} value={customer.customerId}>
                  {customer.displayName || customer.customerName}
                </option>
              ))}
            </select>
          </Field>

          <div className="md:col-span-2">
            <Field label="Remark">
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                className="form-input min-h-24 resize-y"
                placeholder="Optional remark"
              />
            </Field>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(listPath)} className="btn-outline text-xs">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary text-xs">
            {loading ? "Saving..." : isEdit ? "Update Expense" : "Save Expense"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExpensePage;
