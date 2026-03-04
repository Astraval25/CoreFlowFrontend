import useSalesPage from "../hooks/useSalesPage";
import { MdAdd, MdSearch, MdInbox } from "react-icons/md";
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
  const [activeTab, setActiveTab] = useState("quotes");

  const filterByStatus = (statuses) => {
    return allSales.filter((s) => statuses.includes(s.orderStatus));
  };

  const getFilteredSales = () => {
    switch (activeTab) {
      case "quotes":
        return filterByStatus([
          "QUOTATION",
          "QUOTATION_VIEWED",
          "QUOTATION_ACCEPTED",
          "QUOTATION_DECLINED",
        ]);
      case "salesOrder":
        return filterByStatus(["ORDER", "ORDER_VIEWED"]);
      case "invoice":
        return filterByStatus(["ORDER_INVOICED", "ORDER_PAYED"]);
      default:
        return [];
    }
  };

  const filteredSales = getFilteredSales();

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
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-6">
          <h1 className="text-lg font-semibold text-gray-700">Sales</h1>
          <div className="flex gap-10">
            <button
              onClick={() => setActiveTab("report")}
              className={`text-base font-medium cursor-pointer ${
                activeTab === "report"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
            >
              Report
            </button>
            <button
              onClick={() => setActiveTab("quotes")}
              className={`text-base font-medium cursor-pointer ${
                activeTab === "quotes"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
            >
              Quotes
            </button>
            <button
              onClick={() => setActiveTab("salesOrder")}
              className={`text-base font-medium  cursor-pointer ${
                activeTab === "salesOrder"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
            >
              Sales Order
            </button>
            <button
              onClick={() => setActiveTab("invoice")}
              className={`text-base font-medium  cursor-pointer ${
                activeTab === "invoice"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
            >
              Invoices
            </button>
            <button
              onClick={() => setActiveTab("payReceived")}
              className={`text-base font-medium  cursor-pointer ${
                activeTab === "payReceived"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
            >
              Pay Received
            </button>
          </div>
        </div>

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
            {filteredSales.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center py-12"
                >
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <MdInbox size={48} className="mb-2" />
                    <p className="text-gray-500">No data found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      This feature will be available soon
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSales.map((order, index) => (
                <tr
                  key={order.orderId}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewOrder(order);
                  }}
                >
                  <td className="px-6 py-4 text-gray-500 font-semibold text-left">
                    {index + 1}
                  </td>

                  <td className="px-6 py-4 text-blue-600 font-semibold text-left">
                    {order.orderNumber}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {order.orderDate}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {order.sellerCompanyName}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {order.customerName}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    Rs.{order.totalAmount}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    Rs.{order.paidAmount}
                  </td>

                  <td className="px-6 py-4 text-gray-600 font-semibold text-left">
                    {order.orderStatus}
                  </td>

                  <td className="px-6 py-3 text-left">
                    <ActionMenu
                      row={{ original: order }}
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
