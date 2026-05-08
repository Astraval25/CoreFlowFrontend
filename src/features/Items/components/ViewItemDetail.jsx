import { MdEdit, MdInventory2 } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useViewItemDetail from "../hooks/useViewItemDetail";

const money = (value) => `Rs. ${Number(value || 0).toLocaleString()}`;

const ViewItemDetail = ({ companyId, itemId }) => {
  const { item, loading, imageUrl, error } = useViewItemDetail(companyId, itemId);
  const navigate = useNavigate();

  if (!itemId) return <p className="p-6 text-gray-600">Select an item to view details</p>;
  if (loading) return <p className="p-6 text-gray-600">Loading item details...</p>;
  if (error) return <p className="p-6 text-red-600">Error loading item details</p>;

  const handleEdit = () => {
    navigate(`/cf/company/${companyId}/items/${item.itemId}/update`);
  };

  return (
    <div className="w-full">
      <section className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-app-sub">Item Profile</p>
            <h2 className="text-2xl font-bold text-app-text">{item.itemName}</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                {item.itemType || "Type not set"}
              </span>
              <span className="inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                Unit: {item.unit || "-"}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  item.isActive ? "bg-brand-soft text-brand" : "bg-danger-bg text-danger-text"
                }`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg border border-brand-border bg-brand-soft px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand-soft-hover cursor-pointer"
            onClick={handleEdit}
          >
            <MdEdit size={17} />
            Edit Item
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[220px_1fr]">
          <div className="overflow-hidden rounded-xl border border-line bg-app">
            {imageUrl ? (
              <img src={imageUrl} alt={item.itemName} className="h-52 w-full object-cover" />
            ) : (
              <div className="flex h-52 items-center justify-center bg-gradient-to-br from-brand-secondary to-brand text-white">
                <MdInventory2 size={56} />
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-app p-4">
              <h3 className="mb-3 text-sm font-semibold text-app-heading">Pricing</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-app-sub">Sales Price</dt>
                  <dd className="font-semibold text-app-text">{money(item.baseSalesPrice)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-app-sub">Purchase Price</dt>
                  <dd className="font-semibold text-app-text">{money(item.basePurchasePrice)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-app-sub">Tax Rate</dt>
                  <dd className="font-semibold text-app-text">{item.taxRate ?? 0}%</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg bg-app p-4">
              <h3 className="mb-3 text-sm font-semibold text-app-heading">Configuration</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-app-sub">HSN Code</dt>
                  <dd className="font-semibold text-app-text">{item.hsnCode || "-"}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-app-sub">Sellable</dt>
                  <dd className="font-semibold text-app-text">{item.isSellable ? "Yes" : "No"}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-app-sub">Purchasable</dt>
                  <dd className="font-semibold text-app-text">{item.isPurchasable ? "Yes" : "No"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-app p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-app-sub">Sales Description</p>
            <p className="text-sm text-app-soft">{item.salesDescription || "No sales description."}</p>
          </div>
          <div className="rounded-lg bg-app p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-app-sub">Purchase Description</p>
            <p className="text-sm text-app-soft">{item.purchaseDescription || "No purchase description."}</p>
          </div>
        </div>

        <p className="mt-4 text-xs font-medium text-app-muted">
          Last updated on {new Date(item.lastModifiedDt).toLocaleDateString()} at{" "}
          {new Date(item.lastModifiedDt).toLocaleTimeString()}
        </p>
      </section>
    </div>
  );
};

export default ViewItemDetail;
