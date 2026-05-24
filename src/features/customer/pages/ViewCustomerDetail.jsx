import {
  MdBusiness,
  MdCheck,
  MdContentCopy,
  MdEdit,
  MdEmail,
  MdLink,
  MdLocalShipping,
  MdLocationOn,
  MdPhone,
  MdReceiptLong,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import CustomerItems from "../../CustomerItems/pages/CustomerItems";
import useViewCustomerDetail from "../hooks/useViewCustomerDetail";
import { coreApi } from "../../../shared/services/coreApi";
import { emitAppError } from "../../../shared/utils/appError";

const formatAddress = (address) => {
  if (!address) return "Not available";
  const line = [address.line1, address.line2, address.city].filter(Boolean).join(", ");
  const location = [address.state, address.pincode, address.country].filter(Boolean).join(", ");
  return [line, location].filter(Boolean).join(" | ") || "Not available";
};

const CustomerInvitationSection = ({ companyId, customerId }) => {
  const [inviteCode, setInviteCode] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [acceptCode, setAcceptCode] = useState("");
  const [accepting, setAccepting] = useState(false);

  const fetchOrGenerateCode = useCallback(async () => {
    setGenerating(true);
    try {
      const res = await coreApi.getCustomerInvitationCode(companyId, customerId);
      const code = res?.data?.responseData?.invitationCode;
      if (code) {
        setInviteCode(code);
        return;
      }
    } catch {
      // No existing code, generate new one
    }
    try {
      const res = await coreApi.createCustomerInvitation(companyId, customerId);
      setInviteCode(res?.data?.responseData?.invitationCode || null);
    } catch (err) {
      emitAppError(err, "Failed to generate invitation code");
    } finally {
      setGenerating(false);
    }
  }, [companyId, customerId]);

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
        selectedCustomerId: Number(customerId),
      });
      setAcceptCode("");
    } catch (err) {
      emitAppError(err, "Failed to accept invitation");
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="card p-5">
      <h3 className="mb-5 flex items-center justify-between text-sm font-extrabold text-app-text">
        <span>Company Linking</span>
        <MdLink size={16} className="text-info" />
      </h3>

      <div className="space-y-4">
        <div className="rounded-lg p-4 bg-surface-soft">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-app-muted">
            Accept Vendor Invitation
          </p>
          <p className="mb-3 text-[11px] leading-relaxed text-app-sub">
            Enter a code from a vendor company to link this customer to their vendor record.
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={acceptCode}
              onChange={(e) => setAcceptCode(e.target.value.toUpperCase())}
              placeholder="Enter invitation code"
              className="form-input text-sm uppercase tracking-widest"
            />
            <button
              onClick={handleAccept}
              disabled={accepting || !acceptCode.trim()}
              className="btn-primary shrink-0 text-sm"
            >
              {accepting ? "Linking..." : "Accept"}
            </button>
          </div>
        </div>

        <div>
          <p className="mb-3 text-center text-sm font-semibold text-app-sub">
            Need to invite another vendor?
          </p>
          {inviteCode ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span
                className="inline-flex select-all items-center rounded-lg border border-dashed px-3 py-2 text-base font-extrabold tracking-[0.24em]"
                style={{
                  borderColor: "var(--accent-ring-medium)",
                  background: "var(--surface-bg)",
                  color: "var(--accent)",
                }}
              >
                {inviteCode}
              </span>
              <button
                onClick={copyCode}
                className="btn-ghost text-sm"
              >
                {copied ? <MdCheck size={14} /> : <MdContentCopy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          ) : (
            <button
              onClick={fetchOrGenerateCode}
              disabled={generating}
              className="btn-outline w-full justify-center border-dashed text-sm"
            >
              <MdContentCopy size={14} />
              {generating ? "Generating..." : "Generate Invite Code"}
            </button>
          )}
          <p className="mt-3 text-[11px] leading-relaxed text-app-sub">
            Share this code with the vendor company so they can link to this customer.
          </p>
        </div>
      </div>
    </div>
  );
};

const ViewCustomerDetail = ({ companyId, customerId }) => {
  const { customer, loading, error } = useViewCustomerDetail(companyId, customerId);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

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

            {!customer.customerCompany && (
              <CustomerInvitationSection companyId={companyId} customerId={customerId} />
            )}
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
                  <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-surface-soft">
                      <MdReceiptLong size={24} className="text-info" />
                    </div>
                    <p className="text-base font-extrabold text-app-text">Overview content coming soon...</p>
                  </div>
                )}
                {activeTab === "ordertrack" && <div className="text-app-sub">Order Track content coming soon...</div>}
                {activeTab === "transaction" && <div className="text-app-sub">Transaction content coming soon...</div>}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewCustomerDetail;
