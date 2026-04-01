import { MdEdit, MdInventory2, MdPointOfSale } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useViewSalesDetail from "../hooks/useViewSalesDetail";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const ViewSalesDetail = ({ companyId, orderId }) => {
  const { order, orderItems, loading, error } = useViewSalesDetail(companyId, orderId);
  const navigate = useNavigate();

  if (!orderId) return <p className="p-6 text-gray-600">Select an order to view details</p>;
  if (loading) return <p className="p-6 text-gray-600">Loading order details...</p>;
  if (error) return <p className="p-6 text-red-600">Error loading order details</p>;
  if (!order) return <p className="p-6 text-gray-600">No order data available</p>;

  const items = orderItems || [];

  const handleEdit = () => {
    navigate(`/cf/company/${companyId}/sales/${order.orderId}/update`);
  };

  return (
    <div className="w-full">
      <section className="p-5 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b887b]">Sales Order</p>
            <h2 className="text-2xl font-bold text-[#1f2b1f]">{order.orderNumber}</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex rounded-full bg-[#edf4ee] px-3 py-1 text-xs font-semibold text-[#2f7a47]">
                Date: {new Date(order.orderDate).toLocaleDateString()}
              </span>
              <span className="inline-flex rounded-full bg-[#edf4ee] px-3 py-1 text-xs font-semibold text-[#2f7a47]">
                Status: {order.orderStatus || "-"}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  order.isActive ? "bg-[#e8f3ea] text-[#2f7a47]" : "bg-[#fbe9e9] text-[#9a3d3d]"
                }`}
              >
                {order.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg border border-[#cfe0cf] bg-[#edf4ee] px-4 py-2 text-sm font-semibold text-[#2f7a47] transition hover:bg-[#e3eee4] cursor-pointer"
            onClick={handleEdit}
          >
            <MdEdit size={17} />
            Edit Sales
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-[#f8faf8] p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#2d3b2d]">
              <MdPointOfSale size={18} />
              Parties
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-[#748274]">Seller</dt>
                <dd className="font-semibold text-[#1f2b1f]">{order.sellerCompanyName || "-"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#748274]">Customer</dt>
                <dd className="font-semibold text-[#1f2b1f]">{order.customerDisplayName || "-"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#748274]">Vendor</dt>
                <dd className="font-semibold text-[#1f2b1f]">{order.vendorDisplayName || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg bg-[#f8faf8] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#2d3b2d]">Amount Summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-[#748274]">Order Amount</dt>
                <dd className="font-semibold text-[#1f2b1f]">{money(order.orderAmount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#748274]">Tax</dt>
                <dd className="font-semibold text-[#1f2b1f]">{money(order.taxAmount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#748274]">Delivery</dt>
                <dd className="font-semibold text-[#1f2b1f]">{money(order.deliveryCharge)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#748274]">Discount</dt>
                <dd className="font-semibold text-[#1f2b1f]">{money(order.discountAmount)}</dd>
              </div>
              <div className="mt-1 border-t border-[#d8e0d8] pt-2 flex items-center justify-between">
                <dt className="font-semibold text-[#2d3b2d]">Total</dt>
                <dd className="text-base font-bold text-[#2f7a47]">{money(order.totalAmount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#748274]">Paid</dt>
                <dd className="font-semibold text-[#1f2b1f]">{money(order.paidAmount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[#748274]">Has Bill</dt>
                <dd className="font-semibold text-[#1f2b1f]">{order.hasBill ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="border-t border-[#e3e9e3] pt-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#2d3b2d]">
          <MdInventory2 size={18} />
          Sales Items
          </h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-600">No items available for this order.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#e2e8e2]">
              <table className="min-w-full text-sm">
                <thead className="bg-[#f2f6f2] text-[#617061]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Item</th>
                    <th className="px-4 py-3 text-left font-semibold">Qty</th>
                    <th className="px-4 py-3 text-left font-semibold">Price</th>
                    <th className="px-4 py-3 text-left font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.orderItemId} className="border-t border-[#e4ebe4]">
                      <td className="px-4 py-3 font-medium text-[#1f2b1f]">{item.itemName || item.itemId?.itemName || "-"}</td>
                      <td className="px-4 py-3 text-[#4f5d4f]">{item.quantity ?? 0}</td>
                      <td className="px-4 py-3 text-[#4f5d4f]">{money(item.updatedPrice)}</td>
                      <td className="px-4 py-3 font-semibold text-[#1f2b1f]">{money(item.itemTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ViewSalesDetail;
