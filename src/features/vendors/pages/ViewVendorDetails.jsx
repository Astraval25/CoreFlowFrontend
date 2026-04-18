import { MdBusiness, MdEdit, MdEmail, MdLocationOn, MdPhone, MdLink, MdContentCopy, MdCheck } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import VendorItems from "../../VendorItems/pages/VendorItems";
import useViewVendorDetail from "../hooks/useViewVendorDetail";
import { coreApi } from "../../../shared/services/coreApi";

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
      alert(err?.response?.data?.responseMessage || "Failed to generate invitation code");
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
      alert("Invitation accepted successfully! Company linked.");
      setAcceptCode("");
    } catch (err) {
      alert(err?.response?.data?.responseMessage || "Failed to accept invitation");
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="rounded-lg bg-[#f8faf8] p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#2d3b2d]">
        <MdLink size={18} />
        Company Linking
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Generate / Show invitation code */}
        <div className="rounded-lg p-3 bg-white border border-[#e2e8e2]">
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-2 text-[#758275]">
            Invite Code for this Vendor
          </p>
          <p className="text-[11px] mb-3 text-[#8fa490]">
            Share this code with the customer company so they can link to this vendor.
          </p>
          {inviteCode ? (
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center rounded-lg px-4 py-2 text-lg font-bold tracking-[0.3em] select-all border border-dashed border-[#cfe0cf] bg-[#f8faf8] text-[#2f7a47]"
              >
                {inviteCode}
              </span>
              <button
                onClick={copyCode}
                className="btn-ghost text-xs flex items-center gap-1"
              >
                {copied ? <MdCheck size={14} /> : <MdContentCopy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          ) : (
            <button
              onClick={fetchOrGenerateCode}
              disabled={generating}
              className="btn-primary text-xs"
            >
              {generating ? "Generating..." : "Generate Invite Code"}
            </button>
          )}
        </div>

        {/* Accept invitation from customer */}
        <div className="rounded-lg p-3 bg-white border border-[#e2e8e2]">
          <p className="text-[11px] font-semibold uppercase tracking-wide mb-2 text-[#758275]">
            Accept Customer Invitation
          </p>
          <p className="text-[11px] mb-3 text-[#8fa490]">
            Enter a code from a customer company to link this vendor to their customer record.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={acceptCode}
              onChange={(e) => setAcceptCode(e.target.value.toUpperCase())}
              placeholder="Enter code e.g. B6N4KB"
              className="form-input text-xs py-1.5 tracking-widest uppercase"
              style={{ maxWidth: 200 }}
            />
            <button
              onClick={handleAccept}
              disabled={accepting || !acceptCode.trim()}
              className="btn-primary text-xs"
            >
              {accepting ? "Linking..." : "Accept"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ViewVendorDetails = ({ companyId, vendorId }) => {
  const { vendor, loading, error } = useViewVendorDetail(companyId, vendorId);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

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
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b887b]">
              Vendor Profile
            </p>
            <h2 className="text-2xl font-bold text-[#1f2b1f]">{vendor.displayName}</h2>
            <p className="text-sm font-medium text-[#627062]">{vendor.vendorName || "No legal name"}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#edf4ee] px-3 py-1 text-xs font-semibold text-[#2f7a47]">
                <MdPhone size={14} /> {vendor.phone || "No phone"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#edf4ee] px-3 py-1 text-xs font-semibold text-[#2f7a47]">
                <MdEmail size={14} /> {vendor.email || "No email"}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  vendor.isActive ? "bg-[#e8f3ea] text-[#2f7a47]" : "bg-[#fbe9e9] text-[#9a3d3d]"
                }`}
              >
                {vendor.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg border border-[#cfe0cf] bg-[#edf4ee] px-4 py-2 text-sm font-semibold text-[#2f7a47] transition hover:bg-[#e3eee4] cursor-pointer"
            onClick={handleEdit}
          >
            <MdEdit size={17} />
            Edit Vendor
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
              <span className="font-semibold text-[#1f2b1f]">{vendor.gst || "-"}</span>

              <span className="text-[#748274]">PAN</span>
              <span className="font-semibold text-[#1f2b1f]">{vendor.pan || "-"}</span>

              <span className="text-[#748274]">Company</span>
              <span className="font-semibold text-[#2f7a47]">
                {vendor.company?.vendorCompany || vendor.vendorCompany?.companyName || "-"}
              </span>

              <span className="text-[#748274]">Created</span>
              <span className="font-semibold text-[#1f2b1f]">
                {vendor.createdDt ? new Date(vendor.createdDt).toLocaleDateString() : "-"}
              </span>
            </div>
          </div>
        </div>
        {!vendor.vendorCompany && (
          <VendorInvitationSection companyId={companyId} vendorId={vendorId} />
        )}

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
          {activeTab === "items" && <VendorItems vendorId={vendorId} />}
          {activeTab === "overview" && <div className="text-gray-600">Overview content coming soon...</div>}
          {activeTab === "ordertrack" && <div className="text-gray-600">Order Track content coming soon...</div>}
          {activeTab === "transaction" && <div className="text-gray-600">Transaction content coming soon...</div>}
        </div>
      </section>
    </div>
  );
};

export default ViewVendorDetails;
