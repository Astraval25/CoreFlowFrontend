import { MdAdd, MdInbox, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import usePaymentMadePage from "../hooks/usePaymentMadePage";

const fmtMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const PaymentMadePage = () => {
  const {
    companyId,
    filteredPayments,
    globalFilter,
    setGlobalFilter,
    loading,
  } = usePaymentMadePage();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-sm font-bold" style={{ color: "var(--text-main)" }}>
          Payment Made
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search payments..."
              className="form-input pl-8 text-xs py-1.5"
              style={{ width: 240 }}
            />
          </div>
          <button
            className="btn-primary text-xs"
            onClick={() => navigate(`/cf/company/${companyId}/payment-made/create`)}
          >
            <MdAdd size={15} /> New Payment
          </button>
        </div>
      </div>

      <div className="p-4" style={{ background: "var(--surface-bg)" }}>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--line)" }}>
          <table className="w-full min-w-[980px]">
          <thead>
            <tr style={{ background: "var(--surface-muted)", borderBottom: "1px solid var(--line)" }}>
              {["S.No", "Payment No.", "Date", "Vendor", "Orders", "Mode", "Status", "Amount", "Action"].map((header, index) => (
                <th
                  key={header}
                  className={`px-5 py-3 text-[11px] font-bold uppercase tracking-wide ${index === 7 ? "text-right" : "text-left"}`}
                  style={{ color: "var(--text-sub)" }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!loading && filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <MdInbox size={28} style={{ color: "var(--text-sub)" }} />
                    <p className="text-sm" style={{ color: "var(--text-sub)" }}>
                      No payments found
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPayments.map((p, index) => (
                <tr
                  key={p.paymentId}
                  className="cursor-pointer"
                  style={{ borderBottom: "1px solid var(--line-soft)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface-bg)")}
                  onClick={() => navigate(`/cf/company/${companyId}/payment-made/${p.paymentId}/detail`)}
                >
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--text-sub)" }}>{index + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium" style={{ color: "var(--accent-hover)" }}>{p.paymentNumber || "-"}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--text-main)" }}>{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : "-"}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--text-main)" }}>{p.vendorName || "-"}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--text-main)" }}>{p.orderIds || "-"}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "var(--text-main)" }}>{p.modeOfPayment || "-"}</td>
                  <td className="px-5 py-3"><span className="badge badge-blue">{p.paymentStatus || "-"}</span></td>
                  <td className="px-5 py-3 text-sm font-medium tabular-nums text-right" style={{ color: "var(--text-main)" }}>{fmtMoney(p.amount)}</td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-ghost text-xs"
                      onClick={() => navigate(`/cf/company/${companyId}/payment-made/${p.paymentId}/update`)}
                    >
                      Edit
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
  );
};

export default PaymentMadePage;
