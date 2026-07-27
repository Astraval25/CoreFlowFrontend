import useCreatePurchase from "../hooks/useCreatePurchase";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MdAdd, MdDeleteOutline, MdClose } from "react-icons/md";
import { FiSave } from "react-icons/fi";
import { emitAppError } from "../../../shared/utils/appError";

const ORDER_TYPE_LABEL = {
  quote: "Quote",
  order: "Purchase Order",
  bill: "Bill",
};
const ORDER_TYPE_TAB = {
  quote: "quotes",
  order: "purchaseOrder",
  bill: "bill",
};

const fmt = (n) =>
  Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1">
    <label className="text-[11px] font-semibold uppercase tracking-wide text-app-muted">
      {label}{required && <span className="text-danger"> *</span>}
    </label>
    {children}
    {error && <span className="text-[11px] text-danger">{error}</span>}
  </div>
);

const CreatePurchasePage = () => {
  const navigate = useNavigate();
  const { companyId, orderId: paramOrderId } = useParams();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get("type");
  const orderType = ["quote", "order", "bill"].includes(typeParam) ? typeParam : "quote";
  const orderId = paramOrderId || null;
  const purchaseBase = `/cf/company/${companyId}/purchase/list`;

  const {
    formData, items, allVendors, loading, errors, isEditMode,
    subTotal, discountVal, grandTotal,
    handleInputChange, addOrderItem, updateOrderItem, removeOrderItem, submitPurchase,
  } = useCreatePurchase(orderId, orderType);

  const handleSubmit = async () => {
    const result = await submitPurchase();
    if (!result?.success) {
      if (result?.message) emitAppError(result.message);
      return;
    }
    if (isEditMode) {
      navigate(purchaseBase);
      return;
    }
    if (result.statusWarning) {
      emitAppError(result.statusWarning);
      navigate(`${purchaseBase}?tab=quotes`);
    } else {
      navigate(`${purchaseBase}?tab=${ORDER_TYPE_TAB[orderType]}`);
    }
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-surface"
    >
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-8 py-4 shrink-0 border-b border-line"
      >
        <h1 className="text-sm font-bold tracking-tight text-app-text">
          {isEditMode ? `Edit ${ORDER_TYPE_LABEL[orderType]}` : `New ${ORDER_TYPE_LABEL[orderType]}`}
        </h1>
        <button
          onClick={() => navigate(purchaseBase)}
          className="w-7 h-7 rounded-md flex items-center justify-center transition-colors text-app-muted"
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
              className={`form-input ${errors.vendorId ? "border-danger" : ""}`}
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
            <span className="text-[11px] font-semibold uppercase tracking-wide text-app-muted">
              Has Bill
            </span>
            <button
              type="button"
              onClick={() =>
                handleInputChange({
                  target: { name: "hasBill", type: "checkbox", checked: !formData.hasBill },
                })
              }
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-150 self-start ${formData.hasBill ? "bg-brand" : "bg-line"}`}
            >
              <span
                className="inline-block w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-150"
                style={{ transform: formData.hasBill ? "translateX(18px)" : "translateX(2px)" }}
              />
            </button>
          </div>
        </div>

        {/* ── Item Table ── */}
        <div className="border-t border-line">
          <div className="flex items-center justify-between py-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-app-muted">
              Item Table
            </span>
            <button
              type="button"
              className="text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors border border-line text-app-sub"
            >
              Bulk Actions
            </button>
          </div>

          {errors.orderItems && (
            <p className="text-[11px] mb-2 text-danger">{errors.orderItems}</p>
          )}

          <div className="overflow-x-auto -mx-8 px-8">
            <table className="w-full" >
              <thead>
                <tr className="border-b-2 border-line">
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
                      className="py-10 text-center text-xs border-b border-line text-app-muted"
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
                        className="group border-b border-line"
                      >
                        {/* # */}
                        <td className="py-2.5 text-xs text-app-muted" style={{ width: 32, paddingRight: 12 }}>
                          {idx + 1}
                        </td>

                        {/* Item */}
                        <td className="py-2 px-3" style={{ minWidth: 160 }}>
                          <select
                            value={item.itemName}
                            onChange={(e) => updateOrderItem(idx, "itemName", e.target.value)}
                            className={`form-input text-xs py-1.5 ${errors[`item_${idx}_itemId`] ? "border-danger" : ""}`}
                          >
                            <option value="">Select item</option>
                            {items.filter((i) => i.source !== "ITEM_BASE").map((i) => (
                              <option key={`m-${i.itemId}`} value={i.itemName}>{i.itemName}</option>
                            ))}
                            {items.some((i) => i.source === "ITEM_BASE") && (
                              <optgroup label="Catalog items">
                                {items.filter((i) => i.source === "ITEM_BASE").map((i) => (
                                  <option key={`b-${i.itemId}`} value={i.itemName}>{i.itemName}</option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                          {errors[`item_${idx}_itemId`] && (
                            <p className="mt-0.5 text-[10px] text-danger">
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
                        <td className="py-2.5 px-3 text-right text-xs font-semibold tabular-nums text-app-text" style={{ width: 110 }}>
                          {fmt(amount)}
                        </td>

                        {/* Delete */}
                        <td className="py-2.5 text-right" style={{ width: 32, paddingLeft: 8 }}>
                          <button
                            type="button"
                            onClick={() => removeOrderItem(idx)}
                            className="w-6 h-6 rounded flex items-center justify-center ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-danger"
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
          <div className="flex items-center gap-4 py-3 border-b border-line">
            <button
              type="button"
              onClick={addOrderItem}
              className="flex items-center gap-1 text-xs font-semibold transition-colors text-brand"
            >
              <MdAdd size={14} /> Add New Row
            </button>
            <span className="text-line text-xs">|</span>
            <button
              type="button"
              className="flex items-center gap-1 text-xs font-semibold text-app-muted"
            >
              <MdAdd size={14} /> Add Items in Bulk
            </button>
          </div>
        </div>

        {/* ── Bottom section: Notes + Summary ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Vendor Notes */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wide text-app-muted">
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
            <div className="flex justify-between items-center py-3 border-b border-line">
              <span className="text-xs text-app-sub">Sub Total</span>
              <span className="text-xs font-semibold tabular-nums text-app-text">{fmt(subTotal)}</span>
            </div>

            {/* Discount */}
            <div className="flex justify-between items-center gap-4 py-3 border-b border-line">
              <span className="text-xs shrink-0 text-app-sub">Discount</span>
              <div className="flex items-center gap-2 ml-auto">
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleInputChange}
                  className="text-xs py-1 px-1.5 rounded border border-line bg-surface-soft text-app-sub"
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
                <span className="text-xs font-semibold tabular-nums text-right text-app-text" style={{ minWidth: 64 }}>
                  {fmt(discountVal)}
                </span>
              </div>
            </div>

            {/* Tax */}
            <div className="flex justify-between items-center py-3 border-b border-line">
              <span className="text-xs text-app-sub">Tax Amount</span>
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
            <div className="flex justify-between items-center py-3 border-b border-line">
              <span className="text-xs text-app-sub">Delivery Charge</span>
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
              <span className="text-sm font-bold text-app-text">Total (₹)</span>
              <span className="text-xl font-extrabold tabular-nums text-brand">
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
          boxShadow: "0 -2px 10px 0 var(--shadow-soft)",
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
            onClick={() => navigate(purchaseBase)}
            className="text-xs text-app-muted"
          >
            Cancel
          </button>
        </div>
        <span className="text-xs text-app-sub">
          Total Amount:{" "}
          <span className="font-bold text-app-text">₹{fmt(grandTotal)}</span>
        </span>
      </div>
    </div>
  );
};

export default CreatePurchasePage;
