import { useNavigate, useParams } from "react-router-dom";
import { MdEdit, MdPayments } from "react-icons/md";
import usePaymentMadeDetail from "../hooks/usePaymentMadeDetail";

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const statusButtons = [
  { key: "paid", label: "Mark Paid" },
  { key: "viewed", label: "Mark Viewed" },
  { key: "failed", label: "Mark Failed" },
  { key: "refund", label: "Mark Refund" },
  { key: "partiallyPaid", label: "Mark Partially Paid" },
];

const ViewPaymentMadePage = () => {
  const { paymentMadeId } = useParams();
  const { companyId, payment, loading, updateStatus } = usePaymentMadeDetail(paymentMadeId);
  const navigate = useNavigate();

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

        <button
          className="inline-flex items-center gap-2 rounded-lg border border-[#cfe0cf] bg-[#edf4ee] px-4 py-2 text-sm font-semibold text-[#2f7a47] transition hover:bg-[#e3eee4] cursor-pointer"
          onClick={() => navigate(`/cf/company/${companyId}/payment-made/${payment.paymentId}/update`)}
        >
          <MdEdit size={17} />
          Edit Payment
        </button>
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
          <h3 className="mb-3 text-sm font-semibold text-[#2d3b2d]">Update Status</h3>
          <div className="flex flex-wrap gap-2">
            {statusButtons.map((s) => (
              <button
                key={s.key}
                type="button"
                className="btn-ghost text-xs"
                onClick={() => updateStatus(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>
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
