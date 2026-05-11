import { useEffect, useMemo, useState } from "react";
import { MdBusiness, MdInbox, MdSearch, MdStorefront } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { coreApi } from "../../../shared/services/coreApi";

const MarketplaceCompaniesPage = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadCompanies = async () => {
      setLoading(true);
      try {
        const res = await coreApi.getMarketplaceCompanies();
        if (!cancelled) {
          setCompanies(res?.data?.responseData || []);
        }
      } catch (error) {
        console.error("Failed to fetch marketplace companies:", error);
        if (!cancelled) setCompanies([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCompanies();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCompanies = useMemo(() => {
    const q = globalFilter.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter((company) =>
      String(company.companyName || "").toLowerCase().includes(q) ||
      String(company.industry || "").toLowerCase().includes(q) ||
      String(company.city || "").toLowerCase().includes(q) ||
      String(company.state || "").toLowerCase().includes(q) ||
      String(company.country || "").toLowerCase().includes(q)
    );
  }, [companies, globalFilter]);

  return (
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between mb-5 gap-3">
        <div className="flex items-center gap-2">
          <MdStorefront size={18} className="text-brand" />
          <h1 className="text-sm font-bold text-app-text">Marketplace</h1>
        </div>
        <div className="relative">
          <MdSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted"
          />
          <input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search companies..."
            className="form-input pl-8 text-xs py-1.5"
            style={{ width: 260 }}
          />
        </div>
      </div>

      <div className="p-4 bg-surface">
        <div className="rounded-xl overflow-hidden border border-line">
          <table className="w-full min-w-[980px]">
            <thead>
              <tr className="border-b border-line bg-surface-muted">
                {["S.No", "Company", "Industry", "Location", "Contact", "Website"].map((header) => (
                  <th
                    key={header}
                    className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-app-sub"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && filteredCompanies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <MdInbox size={28} className="text-app-sub" />
                      <p className="text-sm text-app-sub">No companies available in marketplace</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCompanies.map((company, index) => (
                  <tr
                    key={company.companyId}
                    className="cursor-pointer border-b border-line-soft hover:bg-surface-hover"
                    onClick={() => navigate(`/cf/marketplace/companies/${company.companyId}`)}
                  >
                    <td className="px-5 py-3 text-sm text-app-sub">{index + 1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-start gap-2">
                        <span className="w-6 h-6 rounded bg-brand-soft text-brand flex items-center justify-center mt-0.5">
                          <MdBusiness size={14} />
                        </span>
                        <div>
                          <div className="text-sm font-medium text-brand-hover">{company.companyName}</div>
                          <div className="text-[11px] text-app-muted">{company.shortName || "-"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-app-text">{company.industry || "-"}</td>
                    <td className="px-5 py-3 text-sm text-app-text">
                      {[company.city, company.state, company.country].filter(Boolean).join(", ") || "-"}
                    </td>
                    <td className="px-5 py-3 text-sm text-app-text">
                      <div>{company.contactPerson || "-"}</div>
                      <div className="text-[11px] text-app-muted">
                        {company.contactEmail || company.contactPhone || "-"}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-app-text">{company.website || "-"}</td>
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

export default MarketplaceCompaniesPage;
