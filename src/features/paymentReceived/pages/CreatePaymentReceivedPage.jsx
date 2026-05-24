import { useNavigate, useParams } from "react-router-dom";
import { MdAdd, MdClose, MdDeleteOutline } from "react-icons/md";
import { FiSave } from "react-icons/fi";
import useCreatePaymentReceived from "../hooks/useCreatePaymentReceived";
import { emitAppError } from "../../../shared/utils/appError";

const fmtMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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

const CreatePaymentReceivedPage = () => {
  const navigate = useNavigate();
  const { companyId, paymentReceivedId } = useParams();

  const {
    allCustomers,
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
  } = useCreatePaymentReceived(paymentReceivedId);

  const paymentBase = `/cf/company/${companyId}/payment-received/list`;

  const handleSubmit = async () => {
    const result = await submitPayment();
    if (result.success) {
      if (!isEditMode && result.paymentId) {
        navigate(`/cf/company/${companyId}/payment-received/${result.paymentId}/detail`);
      } else {
        navigate(paymentBase);
      }
      return;
    }
    if (result.message) {
      emitAppError(result.message);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="card flex items-center justify-between px-6 py-4 shrink-0"
      >
        <h1 className="text-xl font-extrabold tracking-tight text-app-text">
          {isEditMode ? "Edit Payment Received" : "New Payment Received"}
        </h1>
        <button
          onClick={() => navigate(paymentBase)}
          className="w-7 h-7 rounded-md flex items-center justify-center transition-colors text-app-muted"
        >
          <MdClose size={16} />
        </button>
      </div>

      <div className="card flex-1 p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Customer" required error={errors.customerId}>
            <select
              name="customerId"
              value={formData.customerId}
              onChange={handleInputChange}
              disabled={isEditMode}
              className={`form-input ${errors.customerId ? "border-danger" : ""}`}
            >
              <option value="">Select customer</option>
              {allCustomers.map((c) => (
                <option key={c.customerId} value={c.customerId}>
                  {c.displayName || c.customerName}
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
              className={`form-input ${errors.amount ? "border-danger" : ""}`}
              placeholder="0.00"
            />
          </Field>

          <Field label="Payment Date" required error={errors.paymentDate}>
            <input
              type="datetime-local"
              name="paymentDate"
              value={formData.paymentDate}
              onChange={handleInputChange}
              className={`form-input ${errors.paymentDate ? "border-danger" : ""}`}
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

        <div className="border-t border-line pt-1">
          <div className="flex items-center justify-between py-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-app-muted">
              Order Allocations
            </span>
            <button
              type="button"
              onClick={addAllocation}
              className="flex items-center gap-1 text-xs font-semibold text-brand"
            >
              <MdAdd size={14} /> Add Allocation
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" >
              <thead>
                <tr className="border-b-2 border-line">
                  <th className="py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-app-muted">
                    #
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-app-muted">
                    Order
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-app-muted">
                    Amount Applied
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-app-muted">
                    Allocation Date
                  </th>
                  <th className="px-3 py-2.5 text-left text-[10px] font-bold uppercase tracking-wide text-app-muted">
                    Remarks
                  </th>
                  <th className="py-2.5 text-right text-[10px] font-bold uppercase tracking-wide text-app-muted">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {formData.orderAllocations.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-10 text-center text-xs text-app-muted border-b border-line"
                    >
                      No allocations added. You can save payment without allocation.
                    </td>
                  </tr>
                ) : (
                  formData.orderAllocations.map((a, idx) => (
                    <tr key={`${a.paymentOrderAllocationId || "new"}-${idx}`} className="border-b border-line">
                      <td className="py-2.5 text-xs text-app-muted">{idx + 1}</td>
                      <td className="px-3 py-2">
                        <select
                          value={a.orderId}
                          onChange={(e) => updateAllocation(idx, "orderId", e.target.value)}
                          className={`form-input text-xs py-1.5 ${errors[`orderId_${idx}`] ? "border-danger" : ""}`}
                        >
                          <option value="">Select order</option>
                          {orderOptions.map((order) => (
                            <option key={order.orderId} value={order.orderId}>
                              {order.label}
                            </option>
                          ))}
                        </select>
                        {errors[`orderId_${idx}`] && (
                          <p className="mt-0.5 text-[10px] text-danger">{errors[`orderId_${idx}`]}</p>
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
                          <p className="mt-0.5 text-[10px] text-danger">
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
                          <p className="mt-0.5 text-[10px] text-danger">
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
                          className="w-6 h-6 rounded flex items-center justify-center ml-auto text-danger"
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

      <div className="card sticky bottom-0 shrink-0 flex items-center justify-between px-6 py-3">
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
            className="text-xs text-app-muted"
          >
            Cancel
          </button>
        </div>
        <span className="text-xs text-app-sub">
          Allocated: <span className="font-bold text-app-text">{fmtMoney(totalAllocated)}</span>
        </span>
      </div>
    </div>
  );
};

export default CreatePaymentReceivedPage;
