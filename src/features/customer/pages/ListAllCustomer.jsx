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
    <div className="thin-scroll h-[calc(100vh-108px)] overflow-y-auto rounded-2xl border-r border-line bg-white p-3 shadow-sm">
      <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-app-sub">
        Customers
      </p>
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="mb-3 w-full rounded-lg border border-brand-field-border bg-surface-hover px-3 py-2 text-sm font-medium text-brand focus:outline-none"
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
                  ? "border-brand-selected-border bg-brand-soft"
                  : "border-line bg-app hover:bg-surface-soft"
              }`}
          >
            <div className="mb-1 flex items-center justify-between">
              <p className="truncate text-sm font-semibold text-app-text">
                {customer.displayName}
              </p>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  customer.isActive ? "bg-brand" : "bg-danger"
                }`}
              />
            </div>
            <div className="truncate text-xs text-app-sub">
              {customer.email ?? "No Email"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAllCustomer;
