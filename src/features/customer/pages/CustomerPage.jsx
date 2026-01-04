import {
  MdAdd,
  MdDelete,
  MdEditDocument,
  MdChevronLeft,
  MdChevronRight,
  MdSearch,
} from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useCustomer } from "../hooks/useCustomer";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CustomerPage = () => {
  const {
    table,
    globalFilter,
    setGlobalFilter,
    deactivateCustomer,
    allCustomers,
    setCustomers,
  } = useCustomer();
  const navigate = useNavigate();

  const [customerType, setCustomerType] = useState("active");

  const handleCustomerTypeChange = (e) => {
    const value = e.target.value;
    setCustomerType(value);

    if (value === "active") {
      setCustomers(allCustomers.filter((c) => c.isActive === true));
    } else {
      setCustomers(allCustomers.filter((c) => c.isActive === false));
    }
  };

  const handleNewCustomer = () => {
    navigate("/admin/create-customer");
  };

  const handleEditCustomer = (customer) => {
    navigate(`/admin/create-customer?customerId=${customer.customerId}`);
  };

  const handleDeleteCustomer = (customer) => {
    if (window.confirm("Are you sure you want to deactivate this customer?")) {
      deactivateCustomer(customer.customerId);
    }
  };

  const handleViewCustomer = (customer) => {
    navigate(`/admin/view-customer?customerId=${customer.customerId}`);
  };

  return (
    <div className="px-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <select
          value={customerType}
          onChange={handleCustomerTypeChange}
          className="cursor-pointer text-sm font-medium text-gray-700"
        >
          <option value="active">Active Customers</option>
          <option value="deleted">Deleted Customers</option>
        </select>
        
        <div className="relative w-80">
          <MdSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <div className="absolute left-10 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300"></div>
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search customers..."
            className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
               shadow-sm"
          />
        </div>

        {/* <select
          value={customerType}
          onChange={handleCustomerTypeChange}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer"
        >
          <option value="active">Active Customers</option>
          <option value="deleted">Deleted Customers</option>
        </select> */}

        <button
          onClick={handleNewCustomer}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          New
          <MdAdd size={18} />
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-4 text-center font-semibold cursor-pointer select-none"
                  >
                    <div className="flex justify-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getIsSorted() === "asc"}
                      {header.column.getIsSorted() === "desc"}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-gray-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center py-12 text-gray-500"
                >
                  No customers found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewCustomer(row.original);
                  }}
                >
                  {/* S.No */}
                  <td className="px-6 py-4 text-gray-500 font-semibold text-center">
                    {row.index + 1}
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 text-blue-600 font-semibold text-center">
                    {row.getValue("displayName")}
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-gray-600 font-semibold text-center">
                    {row.getValue("email")}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditCustomer(row.original);
                        }}
                        className="px-3 py-1 text-sm rounded cursor-pointer"
                        title="Edit"
                      >
                        <MdEditDocument size={18} className="text-yellow-500" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(row.original)}
                        className="px-3 py-1 text-sm rounded cursor-pointer"
                        title="Delete"
                      >
                        <MdDelete size={18} className="text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-5 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed"
          >
            <MdChevronLeft
              size={18}
              className={
                table.getCanPreviousPage() ? "text-blue-600" : "text-gray-400"
              }
            />
          </button>

          <span className="font-medium px-3 py-1 bg-gray-200 rounded-full text-blue-600">
            {table.getState().pagination.pageIndex + 1}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded-md hover:bg-gray-50 disabled:cursor-not-allowed"
          >
            <MdChevronRight
              size={18}
              className={
                table.getCanNextPage() ? "text-blue-600" : "text-gray-400"
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
