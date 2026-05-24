import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdPayments, MdKeyboardArrowDown, MdUploadFile } from "react-icons/md";
import usePaymentMadeDetail from "../hooks/usePaymentMadeDetail";
import { coreApi } from "../../../shared/services/coreApi";
import { emitAppError } from "../../../shared/utils/appError";

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const statusOptions = [
  { key: "paid", label: "Mark Paid" },
  { key: "viewed", label: "Mark Viewed" },
  { key: "failed", label: "Mark Failed" },
  { key: "refund", label: "Mark Refund" },
  { key: "partiallyPaid", label: "Mark Partially Paid" },
];

const StatusDropdown = ({ onSelect }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand-soft-hover cursor-pointer"
      >
        Update Status <MdKeyboardArrowDown size={16} />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-1 w-44 rounded-lg border bg-white shadow-lg z-50 border-line"
        >
          {statusOptions.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => { onSelect(s.key); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-surface-soft text-app-text"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ViewPaymentMadePage = () => {
  const { paymentMadeId } = useParams();
  const { companyId, payment, loading, updateStatus } = usePaymentMadeDetail(paymentMadeId);
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const handleProofUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await coreApi.uploadPaymentProof(companyId, formData);
    } catch (err) {
      emitAppError(err, "Failed to upload payment proof");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return <p className="p-6 text-app-sub">Loading payment details...</p>;
  }

  if (!payment) {
    return <p className="p-6 text-app-sub">Payment not found.</p>;
  }

  return (
    <div className="card w-full p-5 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-app-sub">
            Payment Made
          </p>
          <h2 className="text-2xl font-bold text-app-text">{payment.paymentNumber || "-"}</h2>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
              Date: {payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : "-"}
            </span>
            <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
              Status: {payment.paymentStatus || "-"}
            </span>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                payment.isActive ? "bg-brand-soft text-brand" : "bg-danger-bg text-danger-text"
              }`}
            >
              {payment.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusDropdown onSelect={updateStatus} />
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-brand-border bg-brand-soft px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand-soft-hover cursor-pointer"
            onClick={() => navigate(`/cf/company/${companyId}/payment-made/${payment.paymentId}/update`)}
          >
            <MdEdit size={17} />
            Edit Payment
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-app p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-app-heading">
            <MdPayments size={18} />
            Payment Info
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-app-sub">Vendor</dt>
              <dd className="font-semibold text-app-text">{payment.vendorDisplayName || "-"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-app-sub">Mode</dt>
              <dd className="font-semibold text-app-text">{payment.modeOfPayment || "-"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-app-sub">Reference</dt>
              <dd className="font-semibold text-app-text">{payment.referenceNumber || "-"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-app-sub">Platform Ref</dt>
              <dd className="font-semibold text-app-text">{payment.platformRef || "-"}</dd>
            </div>
            <div className="mt-1 border-t border-line pt-2 flex items-center justify-between">
              <dt className="font-semibold text-app-heading">Amount</dt>
              <dd className="text-base font-bold text-brand">{money(payment.amount)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg bg-app p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-app-heading">
            <MdUploadFile size={18} />
            Payment Proof
          </h3>
          <p className="text-xs mb-3 text-app-muted">
            Upload a receipt, screenshot, or document as proof of payment.
          </p>
          <label
            className="inline-flex items-center gap-2 rounded-lg border border-brand-border bg-white px-3 py-2 text-xs font-semibold text-brand cursor-pointer transition hover:bg-brand-soft"
          >
            <MdUploadFile size={15} />
            {uploading ? "Uploading..." : "Upload Proof"}
            <input type="file" className="hidden" onChange={handleProofUpload} accept="image/*,.pdf" disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <h3 className="mb-4 text-sm font-semibold text-app-heading">Order Allocations</h3>
        {(payment.orderAllocations || []).length === 0 ? (
          <p className="text-sm text-gray-600">No order allocations found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="min-w-full text-sm">
              <thead className="bg-surface-muted text-app-sub">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Order</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount Applied</th>
                  <th className="px-4 py-3 text-left font-semibold">Allocation Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {payment.orderAllocations.map((a) => (
                  <tr key={a.paymentOrderAllocationId} className="border-t border-line-muted">
                    <td className="px-4 py-3 font-medium text-app-text">{a.orderNumber || a.orderId}</td>
                    <td className="px-4 py-3 text-app-soft">{money(a.amountApplied)}</td>
                    <td className="px-4 py-3 text-app-soft">
                      {a.allocationDate ? new Date(a.allocationDate).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-app-soft">{a.allocationRemarks || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPaymentMadePage;
