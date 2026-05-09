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
    <div className="thin-scroll h-[calc(100vh-108px)] overflow-y-auto rounded-2xl border-r border-line bg-white p-3 shadow-sm">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-app-sub">
        Vendors
      </p>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="mb-3 w-full rounded-lg border border-brand-field-border bg-surface-hover px-3 py-2 text-sm font-medium text-brand focus:outline-none"
      >
        <option value="all">All Vendors</option>
        <option value="active">Active Vendors</option>
        <option value="inactive">Deactive Vendors</option>
      </select>

      <div className="space-y-2">
        {filteredVendors.map((vendor) => (
          <div
            key={vendor.vendorId}
            onClick={() => onSelectVendor(vendor.vendorId)}
            className={`cursor-pointer rounded-xl border px-3 py-3 transition
              ${
                String(selectedVendorId) === String(vendor.vendorId)
                  ? "border-brand-selected-border bg-brand-soft"
                  : "border-line bg-app hover:bg-surface-soft"
              }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="truncate text-sm font-semibold text-app-text">
                {vendor.displayName}
              </p>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  vendor.isActive ? "bg-brand" : "bg-danger"
                }`}
              />
            </div>
            <div className="truncate text-xs text-app-sub">
              {vendor.email ?? "No Email"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAllVendor;

