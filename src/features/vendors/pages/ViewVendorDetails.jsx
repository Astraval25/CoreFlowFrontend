import {
  MdBusiness,
  MdCheck,
  MdContentCopy,
  MdEdit,
  MdEmail,
  MdLink,
  MdLocationOn,
  MdPhone
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import VendorItems from "../../VendorItems/pages/VendorItems";
import useViewVendorDetail from "../hooks/useViewVendorDetail";
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

const VendorInvitationSection = ({ companyId, vendorId }) => {
  const [inviteCode, setInviteCode] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [acceptCode, setAcceptCode] = useState("");
  const [accepting, setAccepting] = useState(false);

  const fetchOrGenerateCode = useCallback(async () => {
    setGenerating(true);
    try {
      const res = await coreApi.getVendorInvitationCode(companyId, vendorId);
      const code = res?.data?.responseData?.invitationCode;
      if (code) {
        setInviteCode(code);
        return;
      }
    } catch {
      // No existing code, generate new one
    }
    try {
      const res = await coreApi.createVendorInvitation(companyId, vendorId);
      setInviteCode(res?.data?.responseData?.invitationCode || null);
    } catch (err) {
      emitAppError(err, "Failed to generate invitation code");
    } finally {
      setGenerating(false);
    }
  }, [companyId, vendorId]);

  const copyCode = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAccept = async () => {
    if (!acceptCode.trim()) return;
    setAccepting(true);
    try {
      await coreApi.acceptInvitation(companyId, acceptCode.trim(), {
        selectedVendorId: Number(vendorId),
      });
      setAcceptCode("");
    } catch (err) {
      emitAppError(err, "Failed to accept invitation");
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="rounded-lg bg-app p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-app-heading">
        <MdLink size={18} />
        Company Linking
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-app-sub">
            Invite Code for this Vendor
          </p>
          <p className="mb-3 text-[11px] text-app-muted">
            Share this code with the customer company so they can link to this vendor.
          </p>
          {inviteCode ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-lg border border-dashed border-brand-border bg-app px-4 py-2 text-lg font-bold tracking-[0.3em] text-brand select-all">
                {inviteCode}
              </span>
              <button onClick={copyCode} className="btn-ghost flex items-center gap-1 text-xs">
                {copied ? <MdCheck size={14} /> : <MdContentCopy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          ) : (
            <button onClick={fetchOrGenerateCode} disabled={generating} className="btn-primary text-xs">
              {generating ? "Generating..." : "Generate Invite Code"}
            </button>
          )}
        </div>

        <div className="rounded-lg border border-line bg-white p-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-app-sub">
            Accept Customer Invitation
          </p>
          <p className="mb-3 text-[11px] text-app-muted">
            Enter a code from a customer company to link this vendor to their customer record.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={acceptCode}
              onChange={(e) => setAcceptCode(e.target.value.toUpperCase())}
              placeholder="Enter code e.g. B6N4KB"
              className="form-input py-1.5 text-xs uppercase tracking-widest"
              style={{ maxWidth: 200 }}
            />
            <button onClick={handleAccept} disabled={accepting || !acceptCode.trim()} className="btn-primary text-xs">
              {accepting ? "Linking..." : "Accept"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewVendorDetails = ({ companyId, vendorId, notice }) => {
  const { vendor, loading, error, refreshVendor } = useViewVendorDetail(companyId, vendorId);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [transactions, setTransactions] = useState({ orders: [], payments: [] });
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [transactionsError, setTransactionsError] = useState("");

  useEffect(() => {
    if (activeTab !== "transaction" || !companyId || !vendorId) return;

    let cancelled = false;

    Promise.resolve()
      .then(() => {
        if (cancelled) return null;
        setTransactionsLoading(true);
        setTransactionsError("");
        return coreApi.getVendorOrdersPayments(companyId, vendorId);
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
        setTransactionsError(err?.response?.data?.responseMessage || "Unable to load vendor transactions");
      })
      .finally(() => {
        if (!cancelled) setTransactionsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, companyId, vendorId]);

  if (!vendorId) return <p className="p-6 text-gray-600">Select a vendor to view details</p>;
  if (loading) return <p className="p-6 text-gray-600">Loading vendor details...</p>;
  if (error) return <p className="p-6 text-red-600">Error loading vendor details</p>;

  const billing = vendor.billingAddrId;
  const shipping = vendor.shippingAddrId;

  const handleEdit = () => {
    navigate(`/cf/company/${companyId}/vendors/${vendor.vendorId}/update`);
  };

  return (
    <div className="w-full">
      <section className="p-5 space-y-6">
        {notice && (
          <div className="rounded-lg border border-brand-border bg-brand-soft px-4 py-3 text-xs font-semibold leading-relaxed text-brand">
            {notice}
          </div>
        )}
        <VendorInvitationSection companyId={companyId} vendorId={vendorId} />
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-app-sub">
              Vendor Profile
            </p>
            <h2 className="text-2xl font-bold text-app-text">{vendor.displayName}</h2>
            <p className="text-sm font-medium text-app-sub">{vendor.vendorName || "No legal name"}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                <MdPhone size={14} /> {vendor.phone || "No phone"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                <MdEmail size={14} /> {vendor.email || "No email"}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  vendor.isActive ? "bg-brand-soft text-brand" : "bg-danger-bg text-danger-text"
                }`}
              >
                {vendor.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg border border-brand-border bg-brand-soft px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand-soft-hover cursor-pointer"
            onClick={handleEdit}
          >
            <MdEdit size={17} />
            Edit Vendor
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-app p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-app-heading">
              <MdLocationOn size={18} />
              Addresses
            </h3>
            <div className="space-y-3 text-sm text-app-soft">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-app-sub">Billing</p>
                <p>{formatAddress(billing)}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-app-sub">Shipping</p>
                <p>{shipping ? formatAddress(shipping) : billing ? "Same as billing" : "Not available"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-app p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-app-heading">
              <MdBusiness size={18} />
              Business Details
            </h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-app-sub">GST</span>
              <span className="font-semibold text-app-text">{vendor.gst || "-"}</span>

              <span className="text-app-sub">PAN</span>
              <span className="font-semibold text-app-text">{vendor.pan || "-"}</span>

              <span className="text-app-sub">Company</span>
              <span className="font-semibold text-brand">
                {vendor.company?.vendorCompany || vendor.vendorCompany?.companyName || "-"}
              </span>

              <span className="text-app-sub">Created</span>
              <span className="font-semibold text-app-text">
                {vendor.createdDt ? new Date(vendor.createdDt).toLocaleDateString() : "-"}
              </span>
            </div>
          </div>
        </div>
        <ConnectionRequestPanel
          status={vendor.connectionStatus}
          linkedCompanyName={vendor.vendorCompany?.companyName || vendor.vendorCompany?.vendorCompany}
          entityLabel="vendor"
          onAccept={async () => {
            await coreApi.acceptVendorConnection(companyId, vendorId);
            await refreshVendor();
          }}
          onReject={async () => {
            await coreApi.rejectVendorConnection(companyId, vendorId);
            await refreshVendor();
          }}
        />

        <div className="border-t border-line pt-2">
          <div className="flex flex-wrap gap-2">
          {[
            { key: "overview", label: "Overview" },
            { key: "items", label: "Items" },
            { key: "ordertrack", label: "Order Track" },
            { key: "transaction", label: "Transaction" },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer transition ${
                activeTab === tab.key
                  ? "bg-brand-soft text-brand"
                  : "text-app-sub hover:bg-surface-soft"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          </div>
        </div>

        <div className="rounded-lg bg-app p-4">
          {activeTab === "items" && <VendorItems vendorId={vendorId} />}
          {activeTab === "overview" && (
            <PartyMonthlyTrend companyId={companyId} partyId={vendorId} partyType="vendor" />
          )}
          {activeTab === "ordertrack" && <div className="text-gray-600">Order Track content coming soon...</div>}
          {activeTab === "transaction" && (
            <PartyTransactionTab
              loading={transactionsLoading}
              error={transactionsError}
              orders={transactions.orders}
              payments={transactions.payments}
              orderTitle="Vendor Orders"
              orderSubtitle="Purchase orders for this vendor"
              paymentTitle="Vendor Payments"
              paymentSubtitle="Payments made to this vendor"
              emptyOrderText="No purchase orders found for this vendor."
              emptyPaymentText="No payments made to this vendor."
              onOrderClick={(order) =>
                navigate(`/cf/company/${companyId}/purchase/${order.orderId}/detail`)
              }
              onPaymentClick={(payment) =>
                navigate(`/cf/company/${companyId}/payment-made/${payment.paymentId}/detail`)
              }
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewVendorDetails;
