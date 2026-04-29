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
    <div className="min-h-screen bg-[#f8f9fc]">
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

      <div className="p-4" style={{ background: "#ffffff" }}>
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e3e7f1" }}>
          <table className="w-full min-w-[980px]">
          <thead>
            <tr style={{ background: "#f7f8fc", borderBottom: "1px solid #e3e7f1" }}>
              {["S.No", "Payment No.", "Date", "Vendor", "Orders", "Mode", "Status", "Amount", "Action"].map((header, index) => (
                <th
                  key={header}
                  className={`px-5 py-3 text-[11px] font-bold uppercase tracking-wide ${index === 7 ? "text-right" : "text-left"}`}
                  style={{ color: "#6a7693" }}
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
                    <MdInbox size={28} style={{ color: "#6a7693" }} />
                    <p className="text-sm" style={{ color: "#6a7693" }}>
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
                  style={{ borderBottom: "1px solid #edf1f8" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8faff")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
                  onClick={() => navigate(`/cf/company/${companyId}/payment-made/${p.paymentId}/detail`)}
                >
                  <td className="px-5 py-3 text-sm" style={{ color: "#6a7693" }}>{index + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium" style={{ color: "#1b5fcc" }}>{p.paymentNumber || "-"}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#202c45" }}>{p.paymentDate ? new Date(p.paymentDate).toLocaleString() : "-"}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#202c45" }}>{p.vendorName || "-"}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#202c45" }}>{p.orderIds || "-"}</td>
                  <td className="px-5 py-3 text-sm" style={{ color: "#202c45" }}>{p.modeOfPayment || "-"}</td>
                  <td className="px-5 py-3"><span className="badge badge-blue">{p.paymentStatus || "-"}</span></td>
                  <td className="px-5 py-3 text-sm font-medium tabular-nums text-right" style={{ color: "#202c45" }}>{fmtMoney(p.amount)}</td>
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
