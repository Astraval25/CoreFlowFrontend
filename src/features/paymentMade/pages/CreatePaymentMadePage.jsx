import { useNavigate, useParams } from "react-router-dom";
import { MdAdd, MdClose, MdDeleteOutline } from "react-icons/md";
import { FiSave } from "react-icons/fi";
import useCreatePaymentMade from "../hooks/useCreatePaymentMade";

const fmtMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">
      {label}
      {required && <span style={{ color: "var(--red)" }}> *</span>}
    </label>
    {children}
    {error && <span className="text-[11px] text-[var(--red)]">{error}</span>}
  </div>
);

const CreatePaymentMadePage = () => {
  const navigate = useNavigate();
  const { companyId, paymentMadeId } = useParams();

  const {
    allVendors,
    orderOptions,
    loading,
    errors,
    isEditMode,
    paymentModes,
    formData,
    totalAllocated,
    handleInputChange,
    addAllocation,
    updateAllocation,
    removeAllocation,
    submitPayment,
  } = useCreatePaymentMade(paymentMadeId);

  const paymentBase = `/cf/company/${companyId}/payment-made/list`;

  const handleSubmit = async () => {
    const result = await submitPayment();
    if (result.success) {
      if (!isEditMode && result.paymentId) {
        navigate(`/cf/company/${companyId}/payment-made/${result.paymentId}/detail`);
      } else {
        navigate(paymentBase);
      }
      return;
    }
    if (result.message) {
      alert(result.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--surface-bg)" }}>
      <div
        className="flex items-center justify-between px-8 py-4 shrink-0"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <h1 className="text-sm font-bold tracking-tight" style={{ color: "var(--text-main)" }}>
          {isEditMode ? "Edit Payment Made" : "New Payment Made"}
        </h1>
        <button
          onClick={() => navigate(paymentBase)}
          className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <MdClose size={16} />
        </button>
      </div>

      <div className="flex-1 px-8 py-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="Vendor" required error={errors.vendorId}>
            <select
              name="vendorId"
              value={formData.vendorId}
              onChange={handleInputChange}
              disabled={isEditMode}
              className="form-input"
              style={{ borderColor: errors.vendorId ? "var(--red)" : undefined }}
            >
              <option value="">Select vendor</option>
              {allVendors.map((v) => (
                <option key={v.vendorId} value={v.vendorId}>
                  {v.displayName || v.vendorName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Amount" required error={errors.amount}>
            <input
              type="number"
              name="amount"
              min="0"
              value={formData.amount}
              onChange={handleInputChange}
              className="form-input"
              placeholder="0.00"
              style={{ borderColor: errors.amount ? "var(--red)" : undefined }}
            />
          </Field>

          <Field label="Payment Date" required error={errors.paymentDate}>
            <input
              type="datetime-local"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleInputChange}
              className="form-input"
              style={{ borderColor: errors.paymentDate ? "var(--red)" : undefined }}
            />
          </Field>

          <Field label="Mode of Payment" required error={errors.modeOfPayment}>
            <select
              name="modeOfPayment"
              value={formData.modeOfPayment}
              onChange={handleInputChange}
              className="form-input"
            >
              {paymentModes.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Reference Number">
            <input
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Transaction/UTR reference"
            />
          </Field>

          <Field label="Payment Remarks">
            <input
              type="text"
              name="paymentRemarks"
              value={formData.paymentRemarks}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Optional notes"
            />
          </Field>
        </div>

        <div style={{ borderTop: "1px solid var(--line)" }}>
          <div className="flex items-center justify-between py-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
              Order Allocations
            </span>
            <button
              type="button"
              onClick={addAllocation}
              className="flex items-center gap-1 text-xs font-semibold text-[var(--accent)]"
            >
              <MdAdd size={14} /> Add Allocation
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--line)" }}>
                  <th className="py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                    #
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                    Order
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                    Amount Applied
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                    Allocation Date
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                    Remarks
                  </th>
                  <th className="py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.orderAllocations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-xs text-[var(--text-muted)]"
                      style={{ borderBottom: "1px solid var(--line)" }}
                    >
                      No allocations added. You can save payment without allocation.
                    </td>
                  </tr>
                ) : (
                  formData.orderAllocations.map((a, idx) => (
                    <tr key={`${a.paymentOrderAllocationId || "new"}-${idx}`} style={{ borderBottom: "1px solid var(--line)" }}>
                      <td className="py-2.5 text-xs text-[var(--text-muted)]">{idx + 1}</td>
                      <td className="px-3 py-2">
                        <select
                          value={a.orderId}
                          onChange={(e) => updateAllocation(idx, "orderId", e.target.value)}
                          className="form-input text-xs py-1.5"
                          style={{ borderColor: errors[`orderId_${idx}`] ? "var(--red)" : undefined }}
                        >
                          <option value="">Select order</option>
                          {orderOptions.map((order) => (
                            <option key={order.orderId} value={order.orderId}>
                              {order.label}
                            </option>
                          ))}
                        </select>
                        {errors[`orderId_${idx}`] && (
                          <p className="mt-0.5 text-[10px] text-[var(--red)]">{errors[`orderId_${idx}`]}</p>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min="0"
                          value={a.amountApplied}
                          onChange={(e) => updateAllocation(idx, "amountApplied", e.target.value)}
                          className="form-input text-xs py-1.5"
                          style={{
                            borderColor: errors[`amountApplied_${idx}`] ? "var(--red)" : undefined,
                          }}
                        />
                        {errors[`amountApplied_${idx}`] && (
                          <p className="mt-0.5 text-[10px] text-[var(--red)]">
                            {errors[`amountApplied_${idx}`]}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="datetime-local"
                          value={a.allocationDate}
                          onChange={(e) => updateAllocation(idx, "allocationDate", e.target.value)}
                          className="form-input text-xs py-1.5"
                          style={{
                            borderColor: errors[`allocationDate_${idx}`] ? "var(--red)" : undefined,
                          }}
                        />
                        {errors[`allocationDate_${idx}`] && (
                          <p className="mt-0.5 text-[10px] text-[var(--red)]">
                            {errors[`allocationDate_${idx}`]}
                          </p>
                        )}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={a.allocationRemarks}
                          onChange={(e) => updateAllocation(idx, "allocationRemarks", e.target.value)}
                          className="form-input text-xs py-1.5"
                          placeholder="Optional remarks"
                        />
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          type="button"
                          onClick={() => removeAllocation(idx)}
                          className="w-6 h-6 rounded flex items-center justify-center ml-auto text-[var(--red)]"
                        >
                          <MdDeleteOutline size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className="sticky bottom-0 shrink-0 flex items-center justify-between px-8 py-3"
        style={{
          background: "var(--surface-bg)",
          borderTop: "1px solid var(--line)",
          boxShadow: "0 -2px 10px 0 var(--shadow-soft)",
        }}
      >
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleSubmit} disabled={loading} className="btn-ghost text-xs">
            <FiSave size={13} /> Save as Draft
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading} className="btn-primary text-xs">
            {loading ? "Saving..." : isEditMode ? "Update Payment" : "Save Payment"}
          </button>
          <button
            type="button"
            onClick={() => navigate(paymentBase)}
            className="text-xs text-[var(--text-muted)]"
          >
            Cancel
          </button>
        </div>
        <span className="text-xs text-[var(--text-sub)]">
          Allocated: <span className="font-bold text-[var(--text-main)]">{fmtMoney(totalAllocated)}</span>
        </span>
      </div>
    </div>
  );
};

export default CreatePaymentMadePage;
