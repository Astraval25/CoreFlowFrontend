import { MdEdit, MdInventory2, MdReceiptLong, MdDownload, MdExpandMore } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState as useLocalState } from "react";
import useViewPurchaseDetail from "../hooks/useViewPurchaseDetail";
import { coreApi } from "../../../shared/services/coreApi";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const ViewPurchaseDetail = ({ companyId, orderId }) => {
  const {
    order: orderData, loading, error, statusUpdating,
    convertToOrder, convertToBill, markPaid,
    acceptQuotation, declineQuotation, cancelOrder,
  } = useViewPurchaseDetail(companyId, orderId);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useLocalState(false);

  const handleDownloadBill = async () => {
    try {
      const res = await coreApi.downloadOrderBill(companyId, orderId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      window.open(url, "_blank");
    } catch (err) {
      console.error("Download bill error:", err);
      alert("Failed to open bill");
    }
  };

  const order = orderData;
  const orderItems = orderData?.orderItems || [];

  if (!orderId) return <p className="p-6 text-gray-600">Select an order to view details</p>;
  if (loading) return <p className="p-6 text-gray-600">Loading order details...</p>;
  if (error) return <p className="p-6 text-red-600">Error loading order details</p>;
  if (!order) return <p className="p-6 text-gray-600">No order data found</p>;

  const status = order.orderStatus;

  const handleEdit = () => {
    navigate(`/cf/company/${companyId}/purchase/${order.orderId}/update`);
  };

  return (
    <div className="w-full">
      <section className="p-5 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-app-sub">Purchase Order</p>
            <h2 className="text-2xl font-bold text-app-text">{order.orderNumber}</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                Date: {new Date(order.orderDate).toLocaleDateString()}
              </span>
              <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                Status: {order.orderStatus || "-"}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  order.hasBill ? "bg-brand-soft text-brand" : "bg-warning-bg text-warning-text"
                }`}
              >
                {order.hasBill ? "Bill Attached" : "No Bill"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-border bg-brand-soft px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand-soft-hover cursor-pointer"
                onClick={() => setDropdownOpen((o) => !o)}
              >
                More Actions <MdExpandMore size={15} />
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 z-20 mt-1 w-56 rounded-lg border border-line bg-white shadow-lg overflow-hidden">
                    <button onClick={() => { handleEdit(); setDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs font-medium text-brand hover:bg-surface-muted flex items-center gap-2">
                      <MdEdit size={13} /> Edit Order
                    </button>
                    {(status === "QUOTATION" || status === "QUOTATION_VIEWED") && (
                      <>
                        <button onClick={() => { acceptQuotation(); setDropdownOpen(false); }}
                          disabled={statusUpdating}
                          className="w-full px-4 py-2.5 text-left text-xs font-medium text-brand hover:bg-surface-muted disabled:opacity-50">
                          Accept Quote
                        </button>
                        <button onClick={() => { declineQuotation(); setDropdownOpen(false); }}
                          disabled={statusUpdating}
                          className="w-full px-4 py-2.5 text-left text-xs font-medium text-danger-text hover:bg-danger-bg disabled:opacity-50">
                          Decline
                        </button>
                      </>
                    )}
                    {(status === "QUOTATION_ACCEPTED" || status === "QUOTATION") && (
                      <button onClick={() => { convertToOrder(); setDropdownOpen(false); }}
                        disabled={statusUpdating}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-brand hover:bg-surface-muted disabled:opacity-50">
                        Convert to Order
                      </button>
                    )}
                    {(status === "ORDER" || status === "ORDER_VIEWED") && (
                      <button onClick={() => { convertToBill(); setDropdownOpen(false); }}
                        disabled={statusUpdating}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-brand hover:bg-surface-muted disabled:opacity-50">
                        Convert to Invoice
                      </button>
                    )}
                    {status === "ORDER_INVOICED" && (
                      <button onClick={() => { markPaid(); setDropdownOpen(false); }}
                        disabled={statusUpdating}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-brand hover:bg-surface-muted disabled:opacity-50">
                        Mark Paid
                      </button>
                    )}
                    {status !== "ORDER_PAYED" && status !== "ORDER_CANCELLED" && (
                      <button onClick={() => { cancelOrder(); setDropdownOpen(false); }}
                        disabled={statusUpdating}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-danger-text hover:bg-danger-bg disabled:opacity-50">
                        Cancel
                      </button>
                    )}
                    <button onClick={() => { handleDownloadBill(); setDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs font-medium text-brand hover:bg-surface-muted flex items-center gap-2">
                      <MdDownload size={13} /> View / Print Bill
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-app p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-app-heading">
              <MdReceiptLong size={18} />
              Parties
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-app-sub">Buyer Company</dt>
                <dd className="font-semibold text-app-text">{order.buyerCompanyName || "-"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-app-sub">Vendor</dt>
                <dd className="font-semibold text-app-text">{order.vendorName || "-"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-app-sub">Paid Amount</dt>
                <dd className="font-semibold text-app-text">{money(order.paidAmount)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg bg-app p-4">
            <h3 className="mb-3 text-sm font-semibold text-app-heading">Amount Summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-app-sub">Order Amount</dt>
                <dd className="font-semibold text-app-text">{money(order.orderAmount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-app-sub">Tax</dt>
                <dd className="font-semibold text-app-text">{money(order.taxAmount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-app-sub">Delivery</dt>
                <dd className="font-semibold text-app-text">{money(order.deliveryCharge)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-app-sub">Discount</dt>
                <dd className="font-semibold text-app-text">{money(order.discountAmount)}</dd>
              </div>
              <div className="mt-1 border-t border-line pt-2 flex items-center justify-between">
                <dt className="font-semibold text-app-heading">Total</dt>
                <dd className="text-base font-bold text-brand">{money(order.totalAmount)}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="border-t border-line pt-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-app-heading">
          <MdInventory2 size={18} />
          Ordered Items
          </h3>
          {orderItems.length === 0 ? (
            <p className="text-sm text-gray-600">No order items available.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-line">
              <table className="min-w-full text-sm">
                <thead className="bg-surface-muted text-app-sub">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Item</th>
                    <th className="px-4 py-3 text-left font-semibold">Qty</th>
                    <th className="px-4 py-3 text-left font-semibold">Price</th>
                    <th className="px-4 py-3 text-left font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.orderItemId} className="border-t border-line-muted">
                      <td className="px-4 py-3 font-medium text-app-text">{item.itemName || item.itemId?.itemName || "-"}</td>
                      <td className="px-4 py-3 text-app-soft">{item.quantity ?? 0}</td>
                      <td className="px-4 py-3 text-app-soft">{money(item.updatedPrice)}</td>
                      <td className="px-4 py-3 font-semibold text-app-text">{money(item.itemTotal)}</td>
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

export default ViewPurchaseDetail;
