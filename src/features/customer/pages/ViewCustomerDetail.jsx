import useViewCustomerDetail from "../hooks/useViewCustomerDetail";
import {
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdBusiness,
  MdEdit,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";

const ViewCustomerDetail = ({ companyId, customerId }) => {
  const { customer, loading, error } = useViewCustomerDetail(
    companyId,
    customerId
  );
  const navigate = useNavigate();

  if (!customerId)
    return (
      <p className="p-6 text-gray-600">Select a customer to view details</p>
    );
  if (loading)
    return <p className="p-6 text-gray-600">Loading customer details...</p>;
  if (error)
    return <p className="p-6 text-red-600">Error loading customer details</p>;

  const billing = customer.billingAddrId;
  const shipping = customer.shippingAddrId;

  const initials = customer.displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleEdit = () => {
    navigate("/admin/create/customer", {
      state: { customerId: customer.customerId },
    });
  };

  return (
    <div className="mx-auto">
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
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
              {initials}
            </div>

            {/* Name + Phone + Email */}
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {customer.displayName}
              </h2>
              <p className="text-sm text-gray-500 font-semibold mb-2">
                {customer.customerName}
              </p>

              {/* Phone */}
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <MdPhone className="text-sm text-gray-500" />
                <span className="text-sm font-semibold text-gray-500">
                  {customer.phone || "No phone"}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 text-gray-700 mt-1">
                <MdEmail className="text-sm text-gray-500" />
                <span className="text-sm font-semibold text-gray-500">
                  {customer.email || "No email"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: Addresses */}
        <div className="bg-[#E2E8F0] rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-2">
            {/* Billing Address */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                <MdLocationOn className="text-lg" />
                Billing Address
              </h3>
              <div className="text-sm text-gray-600 leading-relaxed text-gray-500 font-semibold">
                {billing ? (
                  <>
                    {billing.line1}
                    {billing.line2 ? `, ${billing.line2}` : ""}, {billing.city},{" "}
                    {billing.state} {billing.pincode}, {billing.country}
                  </>
                ) : (
                  "No billing address"
                )}
              </div>
              {billing && (
                <div className="mt-1 space-y-1 text-sm text-gray-500 flex gap-5">
                  {billing.email && (
                    <div className="flex items-center gap-2">
                      <MdEmail className="text-xs" /> {billing.email}
                    </div>
                  )}
                  {billing.phone && (
                    <div className="flex items-center gap-2">
                      <MdPhone className="text-xs" /> {billing.phone}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                <MdLocationOn className="text-lg" />
                Shipping Address
              </h3>
              <div className="text-sm text-gray-600 leading-relaxed  text-gray-500 font-semibold">
                {shipping ? (
                  <>
                    {shipping.line1}
                    {shipping.line2 ? `, ${shipping.line2}` : ""},{" "}
                    {shipping.city}, {shipping.state} {shipping.pincode},{" "}
                    {shipping.country}
                  </>
                ) : billing ? (
                  "Same as billing"
                ) : (
                  "No shipping address"
                )}
              </div>
              {shipping && (
                <div className="mt-1 space-y-1 text-sm text-gray-500 flex gap-5">
                  {shipping.email && (
                    <div className="flex items-center gap-2">
                      <MdEmail className="text-xs" /> {shipping.email}
                    </div>
                  )}
                  {shipping.phone && (
                    <div className="flex items-center gap-2">
                      <MdPhone className="text-xs" /> {shipping.phone}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 3: Other Details */}
        <div className="bg-[#E2E8F0] rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-5">
            <MdBusiness className="text-lg" />
            Other Details
          </h3>

          <div className="grid grid-cols-2 gap-y-4 text-sm">
            {/* GST */}
            <span className="text-gray-500">GST</span>
            <span className="font-medium text-gray-800">
              {customer.gst || "-"}
            </span>

            {/* PAN */}
            <span className="text-gray-500">PAN</span>
            <span className="font-medium text-gray-800">
              {customer.pan || "-"}
            </span>

            {/* Company */}
            <span className="text-gray-500">Company</span>
            <span className="font-medium text-purple-600">
              {customer.customerCompany || "-"}
            </span>

            {/* Created Date */}
            <span className="text-gray-500">Created</span>
            <span className="text-gray-700">
              {new Date(customer.createdDt).toLocaleDateString()}
            </span>

            {/* Status */}
            <span className="text-gray-500">Status</span>
            <span
              className={`font-semibold ${
                customer.isActive ? "text-green-500" : "text-red-600"
              }`}
            >
              {customer.isActive ? "Active" : "Inactive"}
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

export default ViewCustomerDetail;
