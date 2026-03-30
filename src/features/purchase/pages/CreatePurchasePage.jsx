import useCreatePurchase from "../hooks/useCreatePurchase";
import { useNavigate, useParams } from "react-router-dom";
import { MdAdd, MdDeleteOutline, MdClose } from "react-icons/md";
import { FiSave } from "react-icons/fi";

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
      {label}{required && <span style={{ color: "var(--red)" }}> *</span>}
    </label>
    {children}
    {error && <span className="text-[11px]" style={{ color: "var(--red)" }}>{error}</span>}
  </div>
);

const CreatePurchasePage = () => {
  const navigate = useNavigate();
  const { companyId, orderId: paramOrderId } = useParams();
  const orderId = paramOrderId || null;

  const {
    formData, items, allVendors, loading, errors, isEditMode,
    subTotal, discountVal, grandTotal,
    handleInputChange, addOrderItem, updateOrderItem, removeOrderItem, submitPurchase,
  } = useCreatePurchase(orderId);

  const handleSubmit = async () => {
    const result = await submitPurchase();
    if (result?.success) navigate(`/purchase`);
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ background: "var(--surface-bg)" }}
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-8 py-4 shrink-0"
        style={{ borderBottom: "1px solid var(--line)" }}
      >
        <h1 className="text-sm font-bold tracking-tight" style={{ color: "var(--text-main)" }}>
          {isEditMode ? "Edit Purchase Order" : "New Purchase Order"}
        </h1>
        <button
          onClick={() => navigate("/purchase")}
          className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-soft)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <MdClose size={16} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col px-8 py-6 gap-8">

        {/* ── Top fields ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
          <Field label="Vendor Name" required error={errors.vendorId}>
            <select
              name="vendorId"
              value={formData.vendorId}
              onChange={handleInputChange}
              className="form-input"
              style={{ borderColor: errors.vendorId ? "var(--red)" : undefined }}
            >
              <option value="">Select a vendor</option>
              {allVendors.map((v) => (
                <option key={v.vendorId} value={v.vendorId}>{v.displayName}</option>
              ))}
            </select>
          </Field>

          <Field label="Purchase Order Date" required>
            <input
              type="date"
              name="orderDate"
              value={formData.orderDate}
              onChange={handleInputChange}
              className="form-input"
            />
          </Field>

          <div className="flex flex-col gap-1 justify-end pb-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Has Bill
            </span>
            <button
              type="button"
              onClick={() =>
                handleInputChange({
                  target: { name: "hasBill", type: "checkbox", checked: !formData.hasBill },
                })
              }
              className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-150 self-start"
              style={{ background: formData.hasBill ? "var(--accent)" : "var(--line)" }}
            >
              <span
                className="inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-150"
                style={{ transform: formData.hasBill ? "translateX(18px)" : "translateX(2px)" }}
              />
            </button>
          </div>
        </div>

        {/* ── Item Table ── */}
        <div style={{ borderTop: "1px solid var(--line)" }}>
          <div className="flex items-center justify-between py-3">
            <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Item Table
            </span>
            <button
              type="button"
              className="text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors"
              style={{ color: "var(--text-sub)", border: "1px solid var(--line)" }}
            >
              Bulk Actions
            </button>
          </div>

          {errors.orderItems && (
            <p className="text-[11px] mb-2" style={{ color: "var(--red)" }}>{errors.orderItems}</p>
          )}

          <div className="overflow-x-auto -mx-8 px-8">
            <table className="w-full" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--line)" }}>
                  {["#", "ITEM", "DESCRIPTION", "QUANTITY", "RATE", "AMOUNT", ""].map((h, i) => (
                    <th
                      key={i}
                      className={`py-2.5 text-[10px] font-bold uppercase tracking-wide ${
                        i >= 3 && i <= 5 ? "text-right" : "text-left"
                      }`}
                      style={{
                        color: "var(--text-muted)",
                        paddingLeft: i === 0 ? 0 : "12px",
                        paddingRight: i === 6 ? 0 : "12px",
                        width: i === 0 ? 32 : i === 3 || i === 4 || i === 5 ? 110 : i === 6 ? 32 : "auto",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {formData.orderItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-10 text-center text-xs"
                      style={{ color: "var(--text-muted)", borderBottom: "1px solid var(--line)" }}
                    >
                      No items yet — click "+ Add New Row" to start.
                    </td>
                  </tr>
                ) : (
                  formData.orderItems.map((item, idx) => {
                    const amount = Number(item.quantity || 0) * Number(item.updatedPrice || 0);
                    return (
                      <tr
                        key={idx}
                        className="group"
                        style={{ borderBottom: "1px solid var(--line)" }}
                      >
                        {/* # */}
                        <td className="py-2.5 text-xs" style={{ color: "var(--text-muted)", width: 32, paddingRight: 12 }}>
                          {idx + 1}
                        </td>

                        {/* Item */}
                        <td className="py-2 px-3" style={{ minWidth: 160 }}>
                          <select
                            value={item.itemName}
                            onChange={(e) => updateOrderItem(idx, "itemName", e.target.value)}
                            className="form-input text-xs py-1.5"
                            style={{ borderColor: errors[`item_${idx}_itemId`] ? "var(--red)" : undefined }}
                          >
                            <option value="">Select item</option>
                            {items.map((i) => (
                              <option key={i.itemId} value={i.itemName}>{i.itemName}</option>
                            ))}
                          </select>
                          {errors[`item_${idx}_itemId`] && (
                            <p className="mt-0.5 text-[10px]" style={{ color: "var(--red)" }}>
                              {errors[`item_${idx}_itemId`]}
                            </p>
                          )}
                        </td>

                        {/* Description */}
                        <td className="py-2 px-3" style={{ minWidth: 180 }}>
                          <input
                            type="text"
                            value={item.itemDescription}
                            onChange={(e) => updateOrderItem(idx, "itemDescription", e.target.value)}
                            placeholder="Add a description…"
                            className="form-input text-xs py-1.5"
                          />
                        </td>

                        {/* Qty */}
                        <td className="py-2 px-3" style={{ width: 110 }}>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateOrderItem(idx, "quantity", e.target.value)}
                            className="form-input text-xs py-1.5 text-right"
                          />
                        </td>

                        {/* Rate */}
                        <td className="py-2 px-3" style={{ width: 110 }}>
                          <input
                            type="number"
                            min="0"
                            value={item.updatedPrice}
                            onChange={(e) => updateOrderItem(idx, "updatedPrice", e.target.value)}
                            className="form-input text-xs py-1.5 text-right"
                          />
                        </td>

                        {/* Amount */}
                        <td className="py-2.5 px-3 text-right text-xs font-semibold tabular-nums" style={{ color: "var(--text-main)", width: 110 }}>
                          {fmt(amount)}
                        </td>

                        {/* Delete */}
                        <td className="py-2.5 text-right" style={{ width: 32, paddingLeft: 8 }}>
                          <button
                            type="button"
                            onClick={() => removeOrderItem(idx)}
                            className="w-6 h-6 rounded flex items-center justify-center ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: "var(--red)" }}
                          >
                            <MdDeleteOutline size={14} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Add row buttons */}
          <div className="flex items-center gap-4 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
            <button
              type="button"
              onClick={addOrderItem}
              className="flex items-center gap-1 text-xs font-semibold transition-colors"
              style={{ color: "var(--accent)" }}
            >
              <MdAdd size={14} /> Add New Row
            </button>
            <span style={{ color: "var(--line)", fontSize: 12 }}>|</span>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold"
              style={{ color: "var(--text-muted)" }}
            >
              <MdAdd size={14} /> Add Items in Bulk
            </button>
          </div>
        </div>

        {/* ── Bottom section: Notes + Summary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Vendor Notes */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
              Vendor Notes
            </span>
            <textarea
              rows={5}
              placeholder="Notes for internal reference…"
              className="form-input resize-none text-xs"
            />
          </div>

          {/* Summary */}
          <div className="flex flex-col">
            {/* Sub Total */}
            <div className="flex justify-between items-center py-3" style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="text-xs" style={{ color: "var(--text-sub)" }}>Sub Total</span>
              <span className="text-xs font-semibold tabular-nums" style={{ color: "var(--text-main)" }}>{fmt(subTotal)}</span>
            </div>

            {/* Discount */}
            <div className="flex justify-between items-center gap-4 py-3" style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="text-xs shrink-0" style={{ color: "var(--text-sub)" }}>Discount</span>
              <div className="flex items-center gap-2 ml-auto">
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="text-xs py-1 px-1.5 rounded"
                  style={{ border: "1px solid var(--line)", background: "var(--surface-soft)", color: "var(--text-sub)" }}
                >
                  <option value="percent">%</option>
                  <option value="flat">₹</option>
                </select>
                <input
                  type="number"
                  name="discountAmount"
                  value={formData.discountAmount}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="0"
                  className="form-input text-xs py-1 text-right"
                  style={{ width: 72 }}
                />
                <span className="text-xs font-semibold tabular-nums text-right" style={{ color: "var(--text-main)", minWidth: 64 }}>
                  {fmt(discountVal)}
                </span>
              </div>
            </div>

            {/* Tax */}
            <div className="flex justify-between items-center py-3" style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="text-xs" style={{ color: "var(--text-sub)" }}>Tax Amount</span>
              <input
                type="number"
                name="taxAmount"
                value={formData.taxAmount}
                onChange={handleInputChange}
                placeholder="0.00"
                className="form-input text-xs py-1 text-right"
                style={{ width: 112 }}
              />
            </div>

            {/* Adjustment */}
            <div className="flex justify-between items-center py-3" style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="text-xs" style={{ color: "var(--text-sub)" }}>Delivery Charge</span>
              <input
                type="number"
                name="deliveryCharge"
                value={formData.deliveryCharge}
                onChange={handleInputChange}
                placeholder="0.00"
                className="form-input text-xs py-1 text-right"
                style={{ width: 112 }}
              />
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline pt-4">
              <span className="text-sm font-bold" style={{ color: "var(--text-main)" }}>Total (₹)</span>
              <span className="text-xl font-extrabold tabular-nums" style={{ color: "var(--accent)" }}>
                {fmt(grandTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky footer ── */}
      <div
        className="sticky bottom-0 shrink-0 flex items-center justify-between px-8 py-3"
        style={{
          background: "var(--surface-bg)",
          borderTop: "1px solid var(--line)",
          boxShadow: "0 -2px 10px 0 rgba(30,50,30,0.05)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="btn-ghost text-xs"
          >
            <FiSave size={13} /> Save as Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary text-xs"
          >
            {loading ? "Saving…" : isEditMode ? "Update Order" : "Save and Confirm"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/purchase")}
            className="text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            Cancel
          </button>
        </div>
        <span className="text-xs" style={{ color: "var(--text-sub)" }}>
          Total Amount:{" "}
          <span className="font-bold" style={{ color: "var(--text-main)" }}>₹{fmt(grandTotal)}</span>
        </span>
      </div>
    </div>
  );
};

export default CreatePurchasePage;
