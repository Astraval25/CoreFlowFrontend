import { MdAdd, MdInbox, MdSearch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import usePaymentReceivedPage from "../hooks/usePaymentReceivedPage";

const fmtMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const PaymentReceivedPage = () => {
  const {
    companyId,
    filteredPayments,
    globalFilter,
    setGlobalFilter,
    loading,
  } = usePaymentReceivedPage();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-sm font-bold text-app-text">
          Payment Received
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted"
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
            onClick={() => navigate(`/cf/company/${companyId}/payment-received/create`)}
          >
            <MdAdd size={15} /> New Payment
          </button>
        </div>
      </div>

      <div className="p-4 bg-surface">
        <div className="rounded-xl overflow-hidden border border-line">
          <table className="w-full min-w-[980px]">
          <thead>
            <tr className="border-b border-line bg-surface-muted">
              {["S.No", "Payment No.", "Date", "Customer", "Orders", "Mode", "Status", "Amount", "Action"].map((header, index) => (
                <th
                  key={header}
                  className={`px-5 py-3 text-[11px] font-bold uppercase tracking-wide ${index === 7 ? "text-right" : "text-left"} text-app-sub`}
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
                    <MdInbox size={28} className="text-app-sub" />
                    <p className="text-sm text-app-sub">
                      No payments found
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPayments.map((p, index) => (
                <tr
                  key={p.paymentId}
                  className="cursor-pointer border-b border-line-soft"
                  
                  onClick={() => navigate(`/cf/company/${companyId}/payment-received/${p.paymentId}/detail`)}
                >
                  <td className="px-5 py-3 text-sm text-app-sub">{index + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium text-brand-hover">{p.localPaymentNumber || p.paymentNumber || "-"}</td>
                  <td className="px-5 py-3 text-sm text-app-text">{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : "-"}</td>
                  <td className="px-5 py-3 text-sm text-app-text">{p.customerName || "-"}</td>
                  <td className="px-5 py-3 text-sm text-app-text">{p.orderIds || "-"}</td>
                  <td className="px-5 py-3 text-sm text-app-text">{p.modeOfPayment || "-"}</td>
                  <td className="px-5 py-3"><span className="badge badge-blue">{p.paymentStatus || "-"}</span></td>
                  <td className="px-5 py-3 text-sm font-medium tabular-nums text-right text-app-text">{fmtMoney(p.amount)}</td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-ghost text-xs"
                      onClick={() => navigate(`/cf/company/${companyId}/payment-received/${p.paymentId}/update`)}
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

export default PaymentReceivedPage;
