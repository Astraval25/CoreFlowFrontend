import { MdEdit, MdInventory2, MdPointOfSale, MdDownload, MdExpandMore } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState as useLocalState } from "react";
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
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-sub)]">Sales Order</p>
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
                  order.isActive ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "bg-[var(--red-bg)] text-[var(--red-text)]"
                }`}
              >
                {order.isActive ? "Active" : "Inactive"}
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
                      <button onClick={() => { convertToSalesOrder(); setDropdownOpen(false); }}
                        disabled={statusUpdating}
                        className="w-full px-4 py-2.5 text-left text-xs font-medium text-[var(--accent)] hover:bg-[var(--surface-muted)] disabled:opacity-50">
                        Convert to Order
                      </button>
                    )}
                    {(status === "ORDER" || status === "ORDER_VIEWED") && (
                      <button onClick={() => { convertToInvoice(); setDropdownOpen(false); }}
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
              <MdPointOfSale size={18} />
              Parties
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-sub)]">Seller</dt>
                <dd className="font-semibold text-[var(--text-main)]">{order.sellerCompanyName || "-"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-sub)]">Customer</dt>
                <dd className="font-semibold text-[var(--text-main)]">{order.customerDisplayName || "-"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-sub)]">Vendor</dt>
                <dd className="font-semibold text-[var(--text-main)]">{order.vendorDisplayName || "-"}</dd>
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
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-sub)]">Paid</dt>
                <dd className="font-semibold text-[var(--text-main)]">{money(order.paidAmount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-[var(--text-sub)]">Has Bill</dt>
                <dd className="font-semibold text-[var(--text-main)]">{order.hasBill ? "Yes" : "No"}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="border-t border-[var(--line)] pt-4">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[var(--text-heading)]">
          <MdInventory2 size={18} />
          Sales Items
          </h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-600">No items available for this order.</p>
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
                  {items.map((item) => (
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

export default ViewSalesDetail;
