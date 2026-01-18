import useViewVendorDetail from "../hooks/useViewVendorDetail";
import {
  MdPhone,
  MdEmail,
  MdOutlineMailOutline,
  MdLocationOn,
  MdBusiness,
  MdEdit,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ViewVendorDetails = ({ companyId, vendorId }) => {
  const { vendor, loading, error } = useViewVendorDetail(companyId, vendorId);
  const navigate = useNavigate();

  if (!vendorId)
    return <p className="p-6 text-gray-600">Select a vendor to view details</p>;
  if (loading)
    return <p className="p-6 text-gray-600">Loading vendor details...</p>;
  if (error)
    return <p className="p-6 text-red-600">Error loading vendor details</p>;

  const billing = vendor.billingAddrId;
  const shipping = vendor.shippingAddrId;

  const initials = vendor.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleEdit = () => {
    navigate("/admin/create/vendor", {
      state: { vendorId: vendor.vendorId },
    });
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Column 1: Basic Info */}
        <div className="relative bg-[#E2E8F0] rounded-xl shadow-sm border border-gray-200 p-6">
          <button
            className="absolute bottom-6 right-4 text-blue-500 hover:text-blue-600 cursor-pointer flex gap-2"
            onClick={handleEdit}
          >
            <span className="text-blue-500 font-semibold">Edit</span>
            <MdEdit size={18} />
          </button>
          
          {/* Display Name */}
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {vendor.displayName}
          </h2>
          
          {/* Flex layout with custom proportions */}
          <div className="flex gap-4">
            {/* Avatar - 1.5 parts */}
            <div className="flex-[1.5] flex justify-center">
              <div className="w-18 h-18 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {initials}
              </div>
            </div>

            {/* Details - 2.5 parts */}
            <div className="flex-[2.5] flex flex-col">
              <p className="text-base text-gray-500 font-semibold mb-2">
                {vendor.vendorName}
              </p>

              {/* Phone */}
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <MdPhone className="text-sm text-gray-500" />
                <span className="text-sm font-semibold text-gray-500">
                  {vendor.phone || "No phone"}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 text-gray-700">
                <MdEmail className="text-sm text-gray-500" />
                <span className="text-sm font-semibold text-gray-500">
                  {vendor.email || "No email"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Addresses */}
        <div className="bg-[#E2E8F0] rounded-xl shadow-sm border border-gray-200 p-2">
          <h2 className="font-semibold text-base mb-2">Address</h2>
          
          <div className="space-y-4">
            {/* Billing Address */}
            <div>
              <h3 className="font-semibold mb-2 ml-4">Billing Address</h3>
              <div className="text-sm ml-8">
                {billing ? (
                  <>
                    <div>{billing.line1}{billing.line2 ? `, ${billing.line2}` : ""}, {billing.city}</div>
                    <div>{billing.state} {billing.pincode}, {billing.country}</div>
                  </>
                ) : (
                  "No billing address"
                )}
              </div>
              {billing && (
                <div className="flex gap-2 text-sm ml-8">
                  {billing.email && (
                    <div className="flex items-center gap-1">
                      <MdOutlineMailOutline className="text-xs" /> {billing.email}
                    </div>
                  )}
                  {billing.phone && (
                    <div className="flex items-center gap-1">
                      <MdPhone className="text-xs" /> {billing.phone}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold mb-2 ml-4">Shipping Address</h3>
              <div className="text-sm ml-8">
                {shipping ? (
                  <>
                    <div>{shipping.line1}{shipping.line2 ? `, ${shipping.line2}` : ""}, {shipping.city}</div>
                    <div>{shipping.state} {shipping.pincode}, {shipping.country}</div>
                  </>
                ) : billing ? (
                  "Same as billing"
                ) : (
                  "No shipping address"
                )}
              </div>
              {shipping && (
                <div className="flex gap-3 text-sm ml-8">
                  {shipping.email && (
                    <div className="flex items-center gap-1">
                      <MdOutlineMailOutline className="text-xs" /> {shipping.email}
                    </div>
                  )}
                  {shipping.phone && (
                    <div className="flex items-center gap-1">
                      <MdPhone className="text-xs" /> {shipping.phone}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Other Details */}
        <div className="bg-[#E2E8F0] rounded-xl shadow-sm border border-gray-200 p-4">
          <h3 className="flex items-center gap-2 font-semibold text-base mb-5">
            Other Details
          </h3>

          <div className="grid grid-cols-2 gap-y-4 text-sm">
            {/* GST */}
            <span className="font-semibold">GST</span>
            <span className="font-medium text-gray-800">
              {vendor.gst || "-"}
            </span>

            {/* PAN */}
            <span className="font-semibold">PAN</span>
            <span className="font-medium text-gray-800">
              {vendor.pan || "-"}
            </span>

            {/* Company */}
            <span className="font-semibold">Company</span>
            <span className="font-medium text-purple-600">
              {vendor.vendorCompany || "-"}
            </span>

            {/* Created Date */}
            <span className="font-semibold">Created</span>
            <span className="text-gray-700">
              {new Date(vendor.createdDt).toLocaleDateString()}
            </span>

            {/* Status */}
            <span className="font-semibold">Status</span>
            <span
              className={`font-semibold ${
                vendor.isActive ? "text-green-500" : "text-red-600"
              }`}
            >
              {vendor.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-30 w-full mt-5 mb-2">
        <button className="font-semibold text-gray-600">OverView</button>
        <button className="font-semibold text-gray-600">Statistics</button>
        <button className="font-semibold text-gray-600">Order Track</button>
        <button className="font-semibold text-gray-600">Transaction</button>
      </div>
      <hr className="text-gray-300" />
    </div>
  );
};

export default ViewVendorDetails;
