import { MdEdit, MdInventory2, MdPointOfSale, MdDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useViewSalesDetail from "../hooks/useViewSalesDetail";
import { coreApi } from "../../../shared/services/coreApi";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const ViewSalesDetail = ({ companyId, orderId }) => {
  const {
    order, orderItems, loading, error, statusUpdating,
    convertToSalesOrder, convertToInvoice, markPaid,
    acceptQuotation, declineQuotation, cancelOrder,
  } = useViewSalesDetail(companyId, orderId);
  const navigate = useNavigate();

  const handleDownloadBill = async () => {
    try {
      const res = await coreApi.downloadOrderBill(companyId, orderId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `order-bill-${order?.orderNumber || orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download bill error:", err);
      alert("Failed to download bill");
    }
  };

  if (!orderId) return <p className="p-6 text-gray-600">Select an order to view details</p>;
  if (loading) return <p className="p-6 text-gray-600">Loading order details...</p>;
  if (error) return <p className="p-6 text-red-600">Error loading order details</p>;
  if (!order) return <p className="p-6 text-gray-600">No order data available</p>;

  const items = orderItems || [];
  const status = order.orderStatus;

  const handleEdit = () => {
    navigate(`/cf/company/${companyId}/sales/${order.orderId}/update`);
  };

  const TransitionBtn = ({ onClick, children, variant = "primary" }) => {
    const base =
      "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 cursor-pointer";
    const styles = variant === "danger"
      ? "border border-[#f0c2c2] bg-[#fbe9e9] text-[#9a3d3d] hover:bg-[#f6d9d9]"
      : "border border-[#cfe0cf] bg-[#edf4ee] text-[#2f7a47] hover:bg-[#e3eee4]";
    return (
      <button onClick={onClick} disabled={statusUpdating} className={`${base} ${styles}`}>
        {children}
      </button>
    );
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

          <div className="flex flex-wrap items-center gap-2">
            {(status === "QUOTATION" || status === "QUOTATION_VIEWED") && (
              <>
                <TransitionBtn onClick={acceptQuotation}>Accept Quote</TransitionBtn>
                <TransitionBtn onClick={declineQuotation} variant="danger">Decline</TransitionBtn>
              </>
            )}
            {(status === "QUOTATION_ACCEPTED" || status === "QUOTATION") && (
              <TransitionBtn onClick={convertToSalesOrder}>Convert to Order</TransitionBtn>
            )}
            {(status === "ORDER" || status === "ORDER_VIEWED") && (
              <TransitionBtn onClick={convertToInvoice}>Convert to Invoice</TransitionBtn>
            )}
            {status === "ORDER_INVOICED" && (
              <TransitionBtn onClick={markPaid}>Mark Paid</TransitionBtn>
            )}
            {status !== "ORDER_PAYED" && status !== "ORDER_CANCELLED" && (
              <TransitionBtn onClick={cancelOrder} variant="danger">Cancel</TransitionBtn>
            )}
            {order.hasBill && (
              <button
                className="inline-flex items-center gap-2 rounded-lg border border-[#cfe0cf] bg-[#edf4ee] px-3 py-1.5 text-xs font-semibold text-[#2f7a47] transition hover:bg-[#e3eee4] cursor-pointer"
                onClick={handleDownloadBill}
              >
                <MdDownload size={15} />
                Download Bill
              </button>
            )}
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-[#cfe0cf] bg-[#edf4ee] px-3 py-1.5 text-xs font-semibold text-[#2f7a47] transition hover:bg-[#e3eee4] cursor-pointer"
              onClick={handleEdit}
            >
              <MdEdit size={15} />
              Edit
            </button>
          </div>
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
