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
    <div>
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

      <div className="card overflow-hidden">
        <table className="w-full" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "var(--surface-soft)",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                S.No
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Payment No.
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Date
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Vendor
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Orders
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Mode
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Status
              </th>
              <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Amount
              </th>
              <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {!loading && filteredPayments.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <MdInbox size={28} style={{ color: "var(--text-muted)" }} />
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
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
                  style={{ borderBottom: "1px solid var(--line)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  onClick={() =>
                    navigate(`/cf/company/${companyId}/payment-made/${p.paymentId}/detail`)
                  }
                >
                  <td className="px-5 py-3 text-xs text-[var(--text-muted)]">{index + 1}</td>
                  <td className="px-5 py-3 text-xs font-semibold text-[var(--accent)]">
                    {p.paymentNumber || "-"}
                  </td>
                  <td className="px-5 py-3 text-xs text-[var(--text-sub)]">
                    {p.paymentDate ? new Date(p.paymentDate).toLocaleString() : "-"}
                  </td>
                  <td className="px-5 py-3 text-xs text-[var(--text-sub)]">{p.vendorName || "-"}</td>
                  <td className="px-5 py-3 text-xs text-[var(--text-sub)]">{p.orderIds || "-"}</td>
                  <td className="px-5 py-3 text-xs text-[var(--text-sub)]">{p.modeOfPayment || "-"}</td>
                  <td className="px-5 py-3">
                    <span className="badge badge-blue">{p.paymentStatus || "-"}</span>
                  </td>
                  <td className="px-5 py-3 text-xs font-semibold tabular-nums text-right text-[var(--text-main)]">
                    {fmtMoney(p.amount)}
                  </td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-ghost text-xs"
                      onClick={() =>
                        navigate(`/cf/company/${companyId}/payment-made/${p.paymentId}/update`)
                      }
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
  );
};

export default PaymentMadePage;
