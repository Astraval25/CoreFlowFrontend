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
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7b887b]">Item Profile</p>
            <h2 className="text-2xl font-bold text-[#1f2b1f]">{item.itemName}</h2>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex rounded-full bg-[#edf4ee] px-3 py-1 text-xs font-semibold text-[#2f7a47]">
                {item.itemType || "Type not set"}
              </span>
              <span className="inline-flex rounded-full bg-[#edf4ee] px-3 py-1 text-xs font-semibold text-[#2f7a47]">
                Unit: {item.unit || "-"}
              </span>
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  item.isActive ? "bg-[#e8f3ea] text-[#2f7a47]" : "bg-[#fbe9e9] text-[#9a3d3d]"
                }`}
              >
                {item.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-lg border border-[#cfe0cf] bg-[#edf4ee] px-4 py-2 text-sm font-semibold text-[#2f7a47] transition hover:bg-[#e3eee4] cursor-pointer"
            onClick={handleEdit}
          >
            <MdEdit size={17} />
            Edit Item
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-[220px_1fr]">
          <div className="overflow-hidden rounded-xl border border-[#dce4dc] bg-[#f8faf8]">
            {imageUrl ? (
              <img src={imageUrl} alt={item.itemName} className="h-52 w-full object-cover" />
            ) : (
              <div className="flex h-52 items-center justify-center bg-gradient-to-br from-[#4ca567] to-[#2f7a47] text-white">
                <MdInventory2 size={56} />
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-[#f8faf8] p-4">
              <h3 className="mb-3 text-sm font-semibold text-[#2d3b2d]">Pricing</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-[#748274]">Sales Price</dt>
                  <dd className="font-semibold text-[#1f2b1f]">{money(item.baseSalesPrice)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#748274]">Purchase Price</dt>
                  <dd className="font-semibold text-[#1f2b1f]">{money(item.basePurchasePrice)}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#748274]">Tax Rate</dt>
                  <dd className="font-semibold text-[#1f2b1f]">{item.taxRate ?? 0}%</dd>
                </div>
              </dl>
            </div>

            <div className="rounded-lg bg-[#f8faf8] p-4">
              <h3 className="mb-3 text-sm font-semibold text-[#2d3b2d]">Configuration</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-[#748274]">HSN Code</dt>
                  <dd className="font-semibold text-[#1f2b1f]">{item.hsnCode || "-"}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#748274]">Sellable</dt>
                  <dd className="font-semibold text-[#1f2b1f]">{item.isSellable ? "Yes" : "No"}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-[#748274]">Purchasable</dt>
                  <dd className="font-semibold text-[#1f2b1f]">{item.isPurchasable ? "Yes" : "No"}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-[#f8faf8] p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#758275]">Sales Description</p>
            <p className="text-sm text-[#445244]">{item.salesDescription || "No sales description."}</p>
          </div>
          <div className="rounded-lg bg-[#f8faf8] p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#758275]">Purchase Description</p>
            <p className="text-sm text-[#445244]">{item.purchaseDescription || "No purchase description."}</p>
          </div>
        </div>

        <p className="mt-4 text-xs font-medium text-[#7a877a]">
          Last updated on {new Date(item.lastModifiedDt).toLocaleDateString()} at{" "}
          {new Date(item.lastModifiedDt).toLocaleTimeString()}
        </p>
      </section>
    </div>
  );
};

export default ViewItemDetail;
