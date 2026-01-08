import useViewCustomerDetail from "../hooks/useViewCustomerDetail";
import {
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdBusiness,
  MdDateRange,
} from "react-icons/md";

const ViewCustomerDetail = ({ companyId, customerId }) => {
  const { customer, loading, error } = useViewCustomerDetail(
    companyId,
    customerId
  );

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

  return (
    <div className="mx-auto p-1">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Column 1: Basic Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {customer.displayName}
              </h2>
              <p className="text-sm text-gray-500">{customer.customerName}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-700">
              <MdPhone className="text-lg text-gray-500" />
              <span className="text-sm">{customer.phone || "No phone"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <MdEmail className="text-lg text-gray-500" />
              <span className="text-sm">{customer.email || "No email"}</span>
            </div>
          </div>
        </div>

        {/* Column 2: Addresses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-5">
            {/* Billing Address */}
            <div>
              <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                <MdLocationOn className="text-lg" />
                Billing Address
              </h3>
              <div className="text-sm text-gray-600 leading-relaxed">
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
                <div className="mt-1 space-y-1 text-sm text-gray-500">
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
              <div className="text-sm text-gray-600 leading-relaxed">
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
                <div className="mt-1 space-y-1 text-sm text-gray-500">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-5">
            <MdBusiness className="text-lg" />
            Other Details
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-gray-500">GST:</span>
              <span className="ml-2 font-medium text-gray-800">
                {customer.gst || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">PAN:</span>
              <span className="ml-2 font-medium text-gray-800">
                {customer.pan || "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Company:</span>
              <span className="ml-2 font-medium text-gray-800">
                {customer.customerCompany || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <MdDateRange className="text-lg text-gray-500" />
              <span>
                Created: {new Date(customer.createdDt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Status:</span>
              <span
                className={`ml-2 font-semibold ${
                  customer.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {customer.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerDetail;
