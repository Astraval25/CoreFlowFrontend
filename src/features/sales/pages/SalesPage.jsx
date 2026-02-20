import useSalesPage from "../hooks/useSalesPage";
import { MdAdd, MdSearch } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import ActionMenu from "../../../shared/components/ActionMenu";
import { useState } from "react";

const SalesPage = () => {
  const {
    companyId,
    allSales,
    sales,
    setSales,
    table,
    globalFilter,
    setGlobalFilter,
    deactivateSalesOrder,
    activateSalesOrder,
  } = useSalesPage();

  const navigate = useNavigate();
  const [salesType, setSalesType] = useState("active");

  const handleSalesTypeChange = (e) => {
    const value = e.target.value;
    setSalesType(value);

    if (value === "active") {
      setSales(allSales.filter((s) => s.isActive === true));
    } else {
      setSales(allSales.filter((s) => s.isActive === false));
    }
  };

  const handleNewSales = () => {
    navigate("/admin/create/sales");
  };

  const handleViewOrder = (order) => {
    navigate("/admin/view/sales", {
      state: { orderId: order.orderId },
    });
  };

  const handleEditOrder = (order) => {
    navigate("/admin/create/sales", {
      state: { orderId: order.orderId },
    });
  };

  const handleDeleteOrder = (order) => {
    if (window.confirm("Are you sure you want to deactivate this order?")) {
      deactivateSalesOrder(order.orderId);
    }
  };

  const handleActivateOrder = (order) => {
    if (window.confirm("Are you sure you want to activate this order?")) {
      activateSalesOrder(order.orderId);
    }
  };

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-4">
        <select
          value={salesType}
          onChange={handleSalesTypeChange}
          className="cursor-pointer text-sm font-medium text-gray-700 focus:outline-none focus:ring-0"
        >
          <option value="active">Active Orders</option>
          <option value="deleted">Deleted Orders</option>
        </select>

        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <MdSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <div className="absolute left-10 top-1/2 -translate-y-1/2 h-6 w-px bg-gray-300"></div>
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search orders..."
              className="w-full pl-14 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>

          <button
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            onClick={handleNewSales}
          >
            New
            <MdAdd size={18} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-xs uppercase text-gray-600">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-6 py-4 text-left font-semibold cursor-pointer select-none"
                  >
                    <div className="flex gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
                  No Orders found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewOrder(row.original);
                  }}
                >
                  <td className="px-6 py-4 text-gray-500 font-semibold text-left">
                    {row.index + 1}
                  </td>

                  <td className="px-6 py-4 text-blue-600 font-semibold text-left">
                    {row.getValue("orderNumber")}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {row.getValue("orderDate")}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {row.getValue("sellerCompanyName")}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {row.getValue("customerName")}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    Rs.{row.getValue("totalAmount")}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    Rs.{row.getValue("paidAmount")}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {row.getValue("orderStatus")}
                  </td>

                  <td className="px-6 py-3 text-left">
                    <ActionMenu
                      row={row}
                      onEdit={handleEditOrder}
                      onDelete={handleDeleteOrder}
                      onActivate={handleActivateOrder}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesPage;   
