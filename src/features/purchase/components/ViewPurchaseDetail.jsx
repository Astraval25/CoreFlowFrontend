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

  const TransitionBtn = ({ onClick, children, variant = "primary" }) => {
    const base =
      "inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 cursor-pointer";
    const styles = variant === "danger"
      ? "border border-[var(--red-border)] bg-[var(--red-bg)] text-[var(--red-text)] hover:bg-[var(--red-soft)]"
      : "border border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)] hover:bg-[var(--accent-soft-hover)]";
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
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-sub)]">Purchase Order</p>
            <h2 className="text-2xl font-bold text-[var(--text-main)]">{order.orderNumber}</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                Date: {new Date(order.orderDate).toLocaleDateString()}
              </span>
              <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                Status: {order.orderStatus || "-"}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  order.hasBill ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--orange-bg)] text-[var(--orange-text)]"
                }`}
              >
                {order.hasBill ? "Bill Attached" : "No Bill"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft-hover)] cursor-pointer"
              onClick={handleEdit}
            >
              <MdEdit size={15} />
              Edit
            </button>

            {/* Actions dropdown */}
            <div className="relative">
              <button
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] transition hover:bg-[var(--accent-soft-hover)] cursor-pointer"
                onClick={() => setDropdownOpen((o) => !o)}
              >
                Actions <MdExpandMore size={15} />
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 z-20 mt-1 w-48 rounded-lg border border-[var(--line)] bg-white shadow-lg overflow-hidden">
                    {(status === "QUOTATION" || status === "QUOTATION_VIEWED") && (
                      <>
                        <button onClick={() => { acceptQuotation(); setDropdownOpen(false); }}
                          disabled={statusUpdating}
                          className="w-full px-4 py-2.5 text-left text-xs font-medium text-[var(--accent)] hover:bg-[var(--surface-muted)] disabled:opacity-50">
                          Accept Quote
                        </button>
                        <button onClick={() => { declineQuotation(); setDropdownOpen(false); }}
                          disabled={statusUpdating}
                          className="w-full px-4 py-2.5 text-left text-xs font-medium text-[var(--red-text)] hover:bg-[var(--red-bg)] disabled:opacity-50">
                          Decline
                        </button>
                      </>
                    )}
                    {(status === "QUOTATION_ACCEPTED" || status === "QUOTATION") && (
                      <button onClick={() => { convertToOrder(); setDropdownOpen(false); }}
                        disabled={statusUpdating}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-[var(--accent)] hover:bg-[var(--surface-muted)] disabled:opacity-50">
                        Convert to Order
                      </button>
                    )}
                    {(status === "ORDER" || status === "ORDER_VIEWED") && (
                      <button onClick={() => { convertToBill(); setDropdownOpen(false); }}
                        disabled={statusUpdating}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-[var(--accent)] hover:bg-[var(--surface-muted)] disabled:opacity-50">
                        Convert to Invoice
                      </button>
                    )}
                    {status === "ORDER_INVOICED" && (
                      <button onClick={() => { markPaid(); setDropdownOpen(false); }}
                        disabled={statusUpdating}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-[var(--accent)] hover:bg-[var(--surface-muted)] disabled:opacity-50">
                        Mark Paid
                      </button>
                    )}
                    {status !== "ORDER_PAYED" && status !== "ORDER_CANCELLED" && (
                      <button onClick={() => { cancelOrder(); setDropdownOpen(false); }}
                        disabled={statusUpdating}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-[var(--red-text)] hover:bg-[var(--red-bg)] disabled:opacity-50">
                        Cancel
                      </button>
                    )}
                    <button onClick={() => { handleDownloadBill(); setDropdownOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-xs font-medium text-[var(--accent)] hover:bg-[var(--surface-muted)] flex items-center gap-2">
                      <MdDownload size={13} /> View / Print Bill
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-[var(--app-bg)] p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-heading)]">
              <MdReceiptLong size={18} />
              Parties
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-sub)]">Buyer Company</dt>
                <dd className="font-semibold text-[var(--text-main)]">{order.buyerCompanyName || "-"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-sub)]">Vendor</dt>
                <dd className="font-semibold text-[var(--text-main)]">{order.vendorName || "-"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-sub)]">Paid Amount</dt>
                <dd className="font-semibold text-[var(--text-main)]">{money(order.paidAmount)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-lg bg-[var(--app-bg)] p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--text-heading)]">Amount Summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-sub)]">Order Amount</dt>
                <dd className="font-semibold text-[var(--text-main)]">{money(order.orderAmount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-sub)]">Tax</dt>
                <dd className="font-semibold text-[var(--text-main)]">{money(order.taxAmount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-sub)]">Delivery</dt>
                <dd className="font-semibold text-[var(--text-main)]">{money(order.deliveryCharge)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-sub)]">Discount</dt>
                <dd className="font-semibold text-[var(--text-main)]">{money(order.discountAmount)}</dd>
              </div>
              <div className="mt-1 border-t border-[var(--line)] pt-2 flex items-center justify-between">
                <dt className="font-semibold text-[var(--text-heading)]">Total</dt>
                <dd className="text-base font-bold text-[var(--accent)]">{money(order.totalAmount)}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="border-t border-[var(--line)] pt-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--text-heading)]">
          <MdInventory2 size={18} />
          Ordered Items
          </h3>
          {orderItems.length === 0 ? (
            <p className="text-sm text-gray-600">No order items available.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[var(--line)]">
              <table className="min-w-full text-sm">
                <thead className="bg-[var(--surface-muted)] text-[var(--text-sub)]">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Item</th>
                    <th className="px-4 py-3 text-left font-semibold">Qty</th>
                    <th className="px-4 py-3 text-left font-semibold">Price</th>
                    <th className="px-4 py-3 text-left font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr key={item.orderItemId} className="border-t border-[var(--line-muted)]">
                      <td className="px-4 py-3 font-medium text-[var(--text-main)]">{item.itemName || item.itemId?.itemName || "-"}</td>
                      <td className="px-4 py-3 text-[var(--text-soft)]">{item.quantity ?? 0}</td>
                      <td className="px-4 py-3 text-[var(--text-soft)]">{money(item.updatedPrice)}</td>
                      <td className="px-4 py-3 font-semibold text-[var(--text-main)]">{money(item.itemTotal)}</td>
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
