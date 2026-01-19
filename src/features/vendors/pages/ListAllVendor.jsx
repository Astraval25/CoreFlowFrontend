import { useState, useMemo } from "react";
import useListAllVendor from "../hooks/useListAllVendor";

const ListAllVendor = ({ onSelectVendor, selectedVendorId }) => {
  const { vendors, loading, error } = useListAllVendor();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredVendors = useMemo(() => {
    if (!vendors) return [];
    if (statusFilter === "all") return vendors;
    const isActive = statusFilter === "active";
    return vendors.filter((c) => c.isActive === isActive);
  }, [statusFilter, vendors]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading vendors</p>;

  return (
    <div className="h-screen scrollbar-hide">
      {/* Dropdown Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full mb-2 text-sm focus:outline-none text-blue-600 font-medium"
      >
        <option value="all">All Vendors</option>
        <option value="active">Active Vendors</option>
        <option value="inactive">Deactive Vendors</option>
      </select>

      {/* Vendor List */}
      <div>
        {filteredVendors.map((vendor, index) => (
          <div
            key={vendor.vendorId}
            onClick={() => onSelectVendor(vendor.vendorId)}
            className={`p-4 cursor-pointer mb-1
        ${
          selectedVendorId === String(vendor.vendorId)
           ? "bg-blue-50 border-l-4 border-blue-600"
            : "bg-[#E2E8F0] hover:bg-blue-100"
        }
      `}
          >
            <div className="font-medium mb-1">{vendor.displayName}</div>
            <div className="text-sm text-gray-500">
              {vendor.email ?? "No Email"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAllVendor;
