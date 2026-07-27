import {
  MdBusiness,
  MdEdit,
  MdEmail,
  MdLocalShipping,
  MdLocationOn,
  MdPhone,
  MdReceiptLong,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CustomerItems from "../../CustomerItems/pages/CustomerItems";
import useViewCustomerDetail from "../hooks/useViewCustomerDetail";
import { coreApi } from "../../../shared/services/coreApi";
import PartyTransactionTab from "../../../shared/components/PartyTransactionTab";
import PartyMonthlyTrend from "../../../shared/components/PartyMonthlyTrend";
import ConnectionRequestPanel from "../../../shared/components/ConnectionRequestPanel";
import { emitAppError } from "../../../shared/utils/appError";

const formatAddress = (address) => {
  if (!address) return "Not available";
  const line = [address.line1, address.line2, address.city].filter(Boolean).join(", ");
  const location = [address.state, address.pincode, address.country].filter(Boolean).join(", ");
  return [line, location].filter(Boolean).join(" | ") || "Not available";
};

const ViewCustomerDetail = ({ companyId, customerId, notice }) => {
  const { customer, loading, error, refreshCustomer } = useViewCustomerDetail(companyId, customerId);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState({ orders: [], payments: [] });
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState("");

  useEffect(() => {
    if (activeTab !== "transaction" || !companyId || !customerId) return;

    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (cancelled) return null;
        setTransactionsLoading(true);
        setTransactionsError("");
        return coreApi.getCustomerOrdersPayments(companyId, customerId);
      })
      .then((res) => {
        if (cancelled || !res) return;
        const data = res?.data?.responseData || {};
        setTransactions({
          orders: data.orders || [],
          payments: data.payments || [],
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setTransactions({ orders: [], payments: [] });
        setTransactionsError(err?.response?.data?.responseMessage || "Unable to load customer transactions");
      })
      .finally(() => {
        if (!cancelled) setTransactionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, companyId, customerId]);

  if (!customerId) return <p className="p-6 text-gray-600">Select a customer to view details</p>;
  if (loading) return <p className="p-6 text-gray-600">Loading customer details...</p>;
  if (error) return <p className="p-6 text-red-600">Error loading customer details</p>;

  const billing = customer.billingAddrId;
  const shipping = customer.shippingAddrId;

  const handleEdit = () => {
    navigate(`/cf/company/${companyId}/customers/${customer.customerId}/update`);
  };
  const displayName = customer.displayName || "Customer";
  const initial = displayName.trim().charAt(0).toUpperCase() || "C";

  return (
    <div className="w-full">
      <section className="space-y-5 p-5">
        {notice && (
          <div className="rounded-lg border border-brand-border bg-brand-soft px-4 py-3 text-xs font-semibold leading-relaxed text-brand">
            {notice}
          </div>
        )}
        <div className="card flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl font-extrabold text-white bg-brand"
            >
              {initial}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-xl font-extrabold text-app-text">
                  {customer.displayName}
                </h2>
                <span className={customer.isActive ? "badge badge-blue" : "badge badge-red"}>
                  {customer.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-app-sub">
                {customer.customerName || "No legal name"}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-app-sub">
                <span className="inline-flex items-center gap-1.5">
                  <MdEmail size={14} className="text-info" />
                  {customer.email || "No email"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MdPhone size={14} className="text-info" />
                  {customer.phone || "No phone"}
                </span>
              </div>
            </div>
          </div>

          <button
            className="btn-primary justify-center text-sm"
            onClick={handleEdit}
          >
            <MdEdit size={15} />
            Edit Customer
          </button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="mb-5 flex items-center justify-between text-sm font-extrabold text-app-text">
                <span>Business Details</span>
                <MdBusiness size={17} className="text-info" />
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="col-span-2">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-app-muted">Company</p>
                  <p className="break-words text-sm font-semibold text-brand">
                    {customer.company?.customerCompany || customer.customerCompany?.companyName || "-"}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-app-muted">GST Number</p>
                  <p className="break-words text-sm font-semibold text-app-text">{customer.gst || "-"}</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-app-muted">PAN</p>
                  <p className="break-words text-sm font-semibold text-app-text">{customer.pan || "-"}</p>
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-app-muted">Created Date</p>
                  <p className="break-words text-sm font-semibold text-app-text">
                    {customer.createdDt ? new Date(customer.createdDt).toLocaleDateString() : "-"}
                  </p>
                </div>
              </div>
            </div>

            <ConnectionRequestPanel
              status={customer.connectionStatus}
              linkedCompanyName={customer.customerCompany?.companyName || customer.customerCompany?.customerCompany}
              entityLabel="customer"
              onAccept={async () => {
                await coreApi.acceptCustomerConnection(companyId, customerId);
                await refreshCustomer();
              }}
              onReject={async () => {
                await coreApi.rejectCustomerConnection(companyId, customerId);
                await refreshCustomer();
              }}
            />
          </div>

          <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="card relative min-h-36 overflow-hidden p-5">
                <div className="relative z-0">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-app-text">
                    <MdLocationOn size={18} className="text-info" />
                    Billing Address
                  </h3>
                  <p className="text-sm font-bold text-app-text">
                    {billing?.attentionName || billing?.name || customer.customerName || "Billing"}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-app-sub">
                    {formatAddress(billing)}
                  </p>
                </div>
                <MdReceiptLong className="absolute right-4 top-4 opacity-10 text-app-sub" size={58} />
              </div>

              <div className="card relative min-h-36 overflow-hidden p-5">
                <div className="relative z-0">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-extrabold text-app-text">
                    <MdLocalShipping size={18} className="text-info" />
                    Shipping Address
                  </h3>
                  <p className="text-sm font-bold text-app-text">
                    {shipping?.attentionName || shipping?.name || customer.customerName || "Shipping"}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-app-sub">
                    {shipping ? formatAddress(shipping) : billing ? "Same as billing" : "Not available"}
                  </p>
                </div>
                <MdLocalShipping className="absolute right-4 top-4 opacity-10 text-app-sub" size={68} />
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="flex overflow-x-auto border-b border-line">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "items", label: "Items" },
                  { key: "ordertrack", label: "Order Track" },
                  { key: "transaction", label: "Transaction" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className="min-w-28 px-5 py-4 text-sm font-bold transition-colors"
                    style={{
                      borderBottom: activeTab === tab.key ? "2px solid var(--accent)" : "2px solid transparent",
                      color: activeTab === tab.key ? "var(--accent)" : "var(--text-sub)",
                    }}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="min-h-72 p-4">
                {activeTab === "items" && <CustomerItems customerId={customerId} />}
                {activeTab === "overview" && (
                  <PartyMonthlyTrend companyId={companyId} partyId={customerId} partyType="customer" />
                )}
                {activeTab === "ordertrack" && <div className="text-app-sub">Order Track content coming soon...</div>}
                {activeTab === "transaction" && (
                  <PartyTransactionTab
                    loading={transactionsLoading}
                    error={transactionsError}
                    orders={transactions.orders}
                    payments={transactions.payments}
                    orderTitle="Customer Orders"
                    orderSubtitle="Sales orders for this customer"
                    paymentTitle="Customer Payments"
                    paymentSubtitle="Payments received from this customer"
                    emptyOrderText="No sales orders found for this customer."
                    emptyPaymentText="No payments received from this customer."
                    onOrderClick={(order) =>
                      navigate(`/cf/company/${companyId}/sales/${order.orderId}/detail`)
                    }
                    onPaymentClick={(payment) =>
                      navigate(`/cf/company/${companyId}/payment-received/${payment.paymentId}/detail`)
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewCustomerDetail;
