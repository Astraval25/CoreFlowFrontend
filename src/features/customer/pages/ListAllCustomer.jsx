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
    <div className="h-screen scrollbar-hide">
      {/* Dropdown Filter */}
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="w-full p-2 text-sm focus:outline-none text-blue-600 font-medium"
      >
        <option value="all">All Customers</option>
        <option value="active">Active Customers</option>
        <option value="inactive">Deactive Customers</option>
      </select>

      {/* Customer List */}
      <div>
        {filteredCustomers.map((customer, index) => (
          <div
            key={customer.customerId}
            onClick={() => onSelectCustomer(customer.customerId)}
            className={`p-4 cursor-pointer ml-2
        ${
          selectedCustomerId === String(customer.customerId)
            ? "bg-blue-50 border-blue-600"
            : index % 2 === 0
            ? "bg-gray-50 hover:bg-blue-100"
            : "bg-white hover:bg-blue-100"
        }
      `}
          >
            <div className="font-medium mb-1">{customer.displayName}</div>
            <div className="text-sm text-gray-500">
              {customer.email ?? "No Email"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListAllCustomer;
