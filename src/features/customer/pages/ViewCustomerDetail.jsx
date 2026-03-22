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
    navigate("/admin/create/customer", {
      state: { customerId: customer.customerId },
    });
  };

  return (
    <div className="w-full">
      <section className="p-5 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b887b]">
              Customer Profile
            </p>
            <h2 className="text-2xl font-bold text-[#1f2b1f]">{customer.displayName}</h2>
            <p className="text-sm font-medium text-[#627062]">{customer.customerName || "No legal name"}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#edf4ee] px-3 py-1 text-xs font-semibold text-[#2f7a47]">
                <MdPhone size={14} /> {customer.phone || "No phone"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#edf4ee] px-3 py-1 text-xs font-semibold text-[#2f7a47]">
                <MdEmail size={14} /> {customer.email || "No email"}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  customer.isActive ? "bg-[#e8f3ea] text-[#2f7a47]" : "bg-[#fbe9e9] text-[#9a3d3d]"
                }`}
              >
                {customer.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg border border-[#cfe0cf] bg-[#edf4ee] px-4 py-2 text-sm font-semibold text-[#2f7a47] transition hover:bg-[#e3eee4] cursor-pointer"
            onClick={handleEdit}
          >
            <MdEdit size={17} />
            Edit Customer
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-[#f8faf8] p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#2d3b2d]">
              <MdLocationOn size={18} />
              Addresses
            </h3>
            <div className="space-y-3 text-sm text-[#4f5d4f]">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#758275]">Billing</p>
                <p>{formatAddress(billing)}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#758275]">Shipping</p>
                <p>{shipping ? formatAddress(shipping) : billing ? "Same as billing" : "Not available"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-[#f8faf8] p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#2d3b2d]">
              <MdBusiness size={18} />
              Business Details
            </h3>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <span className="text-[#748274]">GST</span>
              <span className="font-semibold text-[#1f2b1f]">{customer.gst || "-"}</span>

              <span className="text-[#748274]">PAN</span>
              <span className="font-semibold text-[#1f2b1f]">{customer.pan || "-"}</span>

              <span className="text-[#748274]">Company</span>
              <span className="font-semibold text-[#2f7a47]">
                {customer.company?.customerCompany || customer.customerCompany?.companyName || "-"}
              </span>

              <span className="text-[#748274]">Created</span>
              <span className="font-semibold text-[#1f2b1f]">
                {customer.createdDt ? new Date(customer.createdDt).toLocaleDateString() : "-"}
              </span>
            </div>
          </div>
        </div>
        <div className="border-t border-[#e3e9e3] pt-2">
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
                  ? "bg-[#e8f3ea] text-[#2f7a47]"
                  : "text-[#596759] hover:bg-[#f2f5f2]"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
          </div>
        </div>

        <div className="rounded-lg bg-[#f8faf8] p-4">
          {activeTab === "items" && <CustomerItems customerId={customerId} />}
          {activeTab === "overview" && <div className="text-gray-600">Overview content coming soon...</div>}
          {activeTab === "ordertrack" && <div className="text-gray-600">Order Track content coming soon...</div>}
          {activeTab === "transaction" && <div className="text-gray-600">Transaction content coming soon...</div>}
        </div>
      </section>
    </div>
  );
};

export default ViewCustomerDetail;
