import { useState, useMemo } from "react";
import useListAllCustomer from "../hooks/useListAllCustomer";

const ListAllCustomer = ({ onSelectCustomer, selectedCustomerId }) => {
  const { customers, loading, error } = useListAllCustomer();
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    if (statusFilter === "all") return customers;
    const isActive = statusFilter === "active";
    return customers.filter((c) => c.isActive === isActive);
  }, [statusFilter, customers]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading customers</p>;

  return (
    <div className="thin-scroll h-[calc(100vh-108px)] overflow-y-auto rounded-2xl border border-[#d9e1d9] bg-white p-3 shadow-sm">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-[#7b887b]">
        Customers
      </p>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="mb-3 w-full rounded-lg border border-[#d7dfd7] bg-[#f7faf7] px-3 py-2 text-sm font-medium text-[#2f7a47] focus:outline-none"
      >
        <option value="all">All Customers</option>
        <option value="active">Active Customers</option>
        <option value="inactive">Deactive Customers</option>
      </select>

      <div className="space-y-2">
        {filteredCustomers.map((customer) => (
          <div
            key={customer.customerId}
            onClick={() => onSelectCustomer(customer.customerId)}
            className={`cursor-pointer rounded-xl border px-3 py-3 transition
              ${
                String(selectedCustomerId) === String(customer.customerId)
                  ? "border-[#b9d8c0] bg-[#edf4ee]"
                  : "border-[#e3e9e3] bg-[#f8faf8] hover:bg-[#f1f6f1]"
              }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="truncate text-sm font-semibold text-[#1f2b1f]">
                {customer.displayName}
              </p>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  customer.isActive ? "bg-[#4a9f66]" : "bg-[#c47b7b]"
                }`}
              />
            </div>
            <div className="truncate text-xs text-[#6a776a]">
              {customer.email ?? "No Email"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAllCustomer;
