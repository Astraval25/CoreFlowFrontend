import { MdBusiness, MdEdit, MdEmail, MdLocationOn, MdPhone } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomerItems from "../../CustomerItems/pages/CustomerItems";
import useViewCustomerDetail from "../hooks/useViewCustomerDetail";

const formatAddress = (address) => {
  if (!address) return "Not available";
  const line = [address.line1, address.line2, address.city].filter(Boolean).join(", ");
  const location = [address.state, address.pincode, address.country].filter(Boolean).join(", ");
  return [line, location].filter(Boolean).join(" | ") || "Not available";
};

const InfoRow = ({ label, value, accent = "var(--text-main)" }) => (
  <div className="flex items-center justify-between gap-4 py-2" style={{ borderBottom: "1px solid var(--line)" }}>
    <span className="text-xs font-medium" style={{ color: "var(--text-sub)" }}>{label}</span>
    <span className="text-xs font-semibold text-right" style={{ color: accent }}>{value}</span>
  </div>
);

const ViewCustomerDetail = ({ companyId, customerId }) => {
  const { customer, loading, error } = useViewCustomerDetail(companyId, customerId);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  if (!customerId) return <p className="p-6" style={{ color: "var(--text-sub)" }}>Select a customer to view details</p>;
  if (loading) return <p className="p-6" style={{ color: "var(--text-sub)" }}>Loading customer details...</p>;
  if (error) return <p className="p-6" style={{ color: "var(--red)" }}>Error loading customer details</p>;

  const billing = customer.billingAddrId;
  const shipping = customer.shippingAddrId;

  const handleEdit = () => {
    navigate(`/cf/company/${companyId}/customers/${customer.customerId}/update`);
  };

  return (
    <div className="w-full">
      <section className="p-3 space-y-3">
        <div className="card p-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--text-sub)" }}>
              Customer Profile
            </p>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-main)" }}>{customer.displayName}</h2>
            <p className="text-sm font-medium" style={{ color: "var(--text-sub)" }}>{customer.customerName || "No legal name"}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "var(--surface-soft)", color: "var(--accent)" }}>
                <MdPhone size={14} /> {customer.phone || "No phone"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: "var(--surface-soft)", color: "var(--accent)" }}>
                <MdEmail size={14} /> {customer.email || "No email"}
              </span>
              <span
                className="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                style={customer.isActive
                  ? { background: "var(--surface-soft)", color: "var(--accent)" }
                  : { background: "#fbe9e9", color: "#9a3d3d" }}
              >
                {customer.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition cursor-pointer"
            style={{ border: "1px solid var(--line)", background: "var(--surface-soft)", color: "var(--accent)" }}
            onClick={handleEdit}
          >
            <MdEdit size={17} />
            Edit Customer
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="card p-3.5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text-main)" }}>
              <MdLocationOn size={18} />
              Addresses
            </h3>
            <div className="space-y-3 text-sm" style={{ color: "var(--text-main)" }}>
              <div className="card p-3" style={{ background: "var(--surface-soft)" }}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-sub)" }}>Billing</p>
                <p className="text-xs" style={{ color: "var(--text-main)" }}>{formatAddress(billing)}</p>
              </div>
              <div className="card p-3" style={{ background: "var(--surface-soft)" }}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-sub)" }}>Shipping</p>
                <p className="text-xs" style={{ color: "var(--text-main)" }}>{shipping ? formatAddress(shipping) : billing ? "Same as billing" : "Not available"}</p>
              </div>
            </div>
          </div>

          <div className="card p-3.5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text-main)" }}>
              <MdBusiness size={18} />
              Business Details
            </h3>
            <div>
              <InfoRow label="GST" value={customer.gst || "-"} />
              <InfoRow label="PAN" value={customer.pan || "-"} />
              <InfoRow
                label="Company"
                value={customer.company?.customerCompany || customer.customerCompany?.companyName || "-"}
                accent="var(--accent)"
              />
              <InfoRow
                label="Created"
                value={customer.createdDt ? new Date(customer.createdDt).toLocaleDateString() : "-"}
              />
            </div>
          </div>
        </div>

        <div className="pt-1.5" style={{ borderTop: "1px solid var(--line)" }}>
          <div className="flex flex-wrap gap-2">
          {[
            { key: "overview", label: "Overview" },
            { key: "items", label: "Items" },
            { key: "ordertrack", label: "Order Track" },
            { key: "transaction", label: "Transaction" },
          ].map((tab) => (
            <button
              key={tab.key}
              className="rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer transition"
              style={activeTab === tab.key
                ? { background: "var(--surface-soft)", color: "var(--accent)" }
                : { color: "var(--text-sub)" }}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          </div>
        </div>

        <div className="card p-3.5">
          {activeTab === "items" && <CustomerItems customerId={customerId} />}
          {activeTab === "overview" && <div style={{ color: "var(--text-sub)" }}>Overview content coming soon...</div>}
          {activeTab === "ordertrack" && <div style={{ color: "var(--text-sub)" }}>Order Track content coming soon...</div>}
          {activeTab === "transaction" && <div style={{ color: "var(--text-sub)" }}>Transaction content coming soon...</div>}
        </div>
      </section>
    </div>
  );
};

export default ViewCustomerDetail;
