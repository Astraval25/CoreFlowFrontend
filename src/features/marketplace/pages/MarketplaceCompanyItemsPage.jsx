import { useEffect, useMemo, useState } from "react";
import { MdArrowBack, MdInbox, MdSearch, MdStorefront } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { coreApi } from "../../../shared/services/coreApi";

const fmtMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const MarketplaceCompanyItemsPage = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [items, setItems] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      try {
        const [companyRes, itemsRes] = await Promise.all([
          coreApi.getMarketplaceCompanyDetail(companyId),
          coreApi.getMarketplaceCompanyItems(companyId),
        ]);
        if (!cancelled) {
          setCompany(companyRes?.data?.responseData || null);
          setItems(itemsRes?.data?.responseData || []);
        }
      } catch (error) {
        console.error("Failed to fetch marketplace company details:", error);
        if (!cancelled) {
          setCompany(null);
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  const filteredItems = useMemo(() => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      String(item.itemName || "").toLowerCase().includes(q) ||
      String(item.itemType || "").toLowerCase().includes(q) ||
      String(item.unit || "").toLowerCase().includes(q) ||
      String(item.salesDescription || "").toLowerCase().includes(q)
    );
  }, [items, globalFilter]);

  return (
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-2">
          <button type="button" className="btn-ghost p-1.5" onClick={() => navigate("/cf/marketplace/companies")}>
            <MdArrowBack size={17} />
          </button>
          <MdStorefront size={18} className="text-brand" />
          <h1 className="text-sm font-bold text-app-text">
            {company?.companyName || "Marketplace Company"}
          </h1>
        </div>
        <div className="relative">
          <MdSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted"
          />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search products..."
            className="form-input pl-8 text-xs py-1.5"
            style={{ width: 260 }}
          />
        </div>
      </div>

      <div className="page-section mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-app-muted">Contact</p>
            <p className="text-sm text-app-text">{company?.contactPerson || "-"}</p>
            <p className="text-xs text-app-sub">{company?.contactEmail || "-"}</p>
            <p className="text-xs text-app-sub">{company?.contactPhone || "-"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-app-muted">Location</p>
            <p className="text-sm text-app-text">
              {[company?.addressLine1, company?.addressLine2].filter(Boolean).join(", ") || "-"}
            </p>
            <p className="text-xs text-app-sub">
              {[company?.city, company?.state, company?.postalCode].filter(Boolean).join(", ") || "-"}
            </p>
            <p className="text-xs text-app-sub">{company?.country || "-"}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-app-muted">Business</p>
            <p className="text-sm text-app-text">{company?.industry || "-"}</p>
            <p className="text-xs text-app-sub">{company?.website || "-"}</p>
          </div>
        </div>
        {company?.publicDescription && (
          <p className="mt-3 text-sm text-app-soft">{company.publicDescription}</p>
        )}
      </div>

      <div className="p-4 bg-surface">
        <div className="rounded-xl overflow-hidden border border-line">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="border-b border-line bg-surface-muted">
                {["S.No", "Product", "Type", "Unit", "Sales Price", "Tax", "Description"].map((header, index) => (
                  <th
                    key={header}
                    className={`px-5 py-3 text-[11px] font-bold uppercase tracking-wide ${index === 4 ? "text-right" : "text-left"} text-app-sub`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MdInbox size={28} className="text-app-sub" />
                      <p className="text-sm text-app-sub">No sellable products found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, index) => (
                  <tr key={item.itemId} className="border-b border-line-soft hover:bg-surface-hover">
                    <td className="px-5 py-3 text-sm text-app-sub">{index + 1}</td>
                    <td className="px-5 py-3 text-sm font-medium text-brand-hover">{item.itemName}</td>
                    <td className="px-5 py-3 text-sm text-app-text">{item.itemType || "-"}</td>
                    <td className="px-5 py-3 text-sm text-app-text">{item.unit || "-"}</td>
                    <td className="px-5 py-3 text-sm font-semibold tabular-nums text-right text-app-text">
                      {fmtMoney(item.salesPrice)}
                    </td>
                    <td className="px-5 py-3 text-sm text-app-text">{item.taxRate ?? "-"}</td>
                    <td className="px-5 py-3 text-sm text-app-text">{item.salesDescription || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCompanyItemsPage;
