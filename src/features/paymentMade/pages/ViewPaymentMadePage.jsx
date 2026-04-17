import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdPayments, MdKeyboardArrowDown, MdUploadFile } from "react-icons/md";
import usePaymentMadeDetail from "../hooks/usePaymentMadeDetail";
import { coreApi } from "../../../shared/services/coreApi";

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
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#cfe0cf] bg-[#edf4ee] px-3 py-1.5 text-xs font-semibold text-[#2f7a47] transition hover:bg-[#e3eee4] cursor-pointer"
      >
        Update Status <MdKeyboardArrowDown size={16} />
      </button>
      {open && (
        <div
          className="absolute right-0 mt-1 w-44 rounded-lg border bg-white shadow-lg z-50"
          style={{ borderColor: "var(--line)" }}
        >
          {statusOptions.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => { onSelect(s.key); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs transition-colors hover:bg-[var(--surface-soft)]"
              style={{ color: "var(--text-main)" }}
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
      alert("Payment proof uploaded successfully");
    } catch (err) {
      alert(err?.response?.data?.responseMessage || "Failed to upload payment proof");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loading) {
    return <p className="p-6 text-gray-600">Loading payment details...</p>;
  }

  if (!payment) {
    return <p className="p-6 text-gray-600">Payment not found.</p>;
  }

  return (
    <div className="w-full rounded-2xl border border-[#d9e1d9] bg-white shadow-sm p-5 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b887b]">
            Payment Made
          </p>
          <h2 className="text-2xl font-bold text-[#1f2b1f]">{payment.paymentNumber || "-"}</h2>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex rounded-full bg-[#edf4ee] px-3 py-1 text-xs font-semibold text-[#2f7a47]">
              Date: {payment.paymentDate ? new Date(payment.paymentDate).toLocaleString() : "-"}
            </span>
            <span className="inline-flex rounded-full bg-[#edf4ee] px-3 py-1 text-xs font-semibold text-[#2f7a47]">
              Status: {payment.paymentStatus || "-"}
            </span>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                payment.isActive ? "bg-[#e8f3ea] text-[#2f7a47]" : "bg-[#fbe9e9] text-[#9a3d3d]"
              }`}
            >
              {payment.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <StatusDropdown onSelect={updateStatus} />
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-[#cfe0cf] bg-[#edf4ee] px-4 py-2 text-sm font-semibold text-[#2f7a47] transition hover:bg-[#e3eee4] cursor-pointer"
            onClick={() => navigate(`/cf/company/${companyId}/payment-made/${payment.paymentId}/update`)}
          >
            <MdEdit size={17} />
            Edit Payment
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-[#f8faf8] p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#2d3b2d]">
            <MdPayments size={18} />
            Payment Info
          </h3>
          <dl className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-[#748274]">Vendor</dt>
              <dd className="font-semibold text-[#1f2b1f]">{payment.vendorDisplayName || "-"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[#748274]">Mode</dt>
              <dd className="font-semibold text-[#1f2b1f]">{payment.modeOfPayment || "-"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[#748274]">Reference</dt>
              <dd className="font-semibold text-[#1f2b1f]">{payment.referenceNumber || "-"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-[#748274]">Platform Ref</dt>
              <dd className="font-semibold text-[#1f2b1f]">{payment.platformRef || "-"}</dd>
            </div>
            <div className="mt-1 border-t border-[#d8e0d8] pt-2 flex items-center justify-between">
              <dt className="font-semibold text-[#2d3b2d]">Amount</dt>
              <dd className="text-base font-bold text-[#2f7a47]">{money(payment.amount)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg bg-[#f8faf8] p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#2d3b2d]">
            <MdUploadFile size={18} />
            Payment Proof
          </h3>
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
            Upload a receipt, screenshot, or document as proof of payment.
          </p>
          <label
            className="inline-flex items-center gap-2 rounded-lg border border-[#cfe0cf] bg-white px-3 py-2 text-xs font-semibold text-[#2f7a47] cursor-pointer transition hover:bg-[#edf4ee]"
          >
            <MdUploadFile size={15} />
            {uploading ? "Uploading..." : "Upload Proof"}
            <input type="file" className="hidden" onChange={handleProofUpload} accept="image/*,.pdf" disabled={uploading} />
          </label>
        </div>
      </div>

      <div className="border-t border-[#e3e9e3] pt-4">
        <h3 className="mb-4 text-sm font-semibold text-[#2d3b2d]">Order Allocations</h3>
        {(payment.orderAllocations || []).length === 0 ? (
          <p className="text-sm text-gray-600">No order allocations found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#e2e8e2]">
            <table className="min-w-full text-sm">
              <thead className="bg-[#f2f6f2] text-[#617061]">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Order</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount Applied</th>
                  <th className="px-4 py-3 text-left font-semibold">Allocation Date</th>
                  <th className="px-4 py-3 text-left font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {payment.orderAllocations.map((a) => (
                  <tr key={a.paymentOrderAllocationId} className="border-t border-[#e4ebe4]">
                    <td className="px-4 py-3 font-medium text-[#1f2b1f]">{a.orderNumber || a.orderId}</td>
                    <td className="px-4 py-3 text-[#4f5d4f]">{money(a.amountApplied)}</td>
                    <td className="px-4 py-3 text-[#4f5d4f]">
                      {a.allocationDate ? new Date(a.allocationDate).toLocaleString() : "-"}
                    </td>
                    <td className="px-4 py-3 text-[#4f5d4f]">{a.allocationRemarks || "-"}</td>
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
