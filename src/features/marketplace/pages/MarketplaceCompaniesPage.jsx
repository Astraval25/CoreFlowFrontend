import { useEffect, useMemo, useState } from "react";
import {
  MdArrowForward,
  MdBusiness,
  MdInbox,
  MdSearch,
  MdStorefront,
} from "react-icons/md";
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
    return companies.filter(
      (company) =>
        String(company.companyName || "").toLowerCase().includes(q) ||
        String(company.industry || "").toLowerCase().includes(q) ||
        String(company.city || "").toLowerCase().includes(q) ||
        String(company.state || "").toLowerCase().includes(q) ||
        String(company.country || "").toLowerCase().includes(q)
    );
  }, [companies, globalFilter]);

  return (
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
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
            placeholder="Search companies"
            className="form-input pl-8 text-xs py-1.5 w-64"
          />
        </div>
      </div>

      {!loading && filteredCompanies.length === 0 ? (
        <div className="page-section py-16">
          <div className="flex flex-col items-center gap-2">
            <MdInbox size={28} className="text-app-sub" />
            <p className="text-sm text-app-sub">No companies found</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => {
            const location =
              [company.city, company.state, company.country]
                .filter(Boolean)
                .join(", ") || "Location not specified";
            return (
              <article
                key={company.companyId}
                className="card p-4 border border-line hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() =>
                  navigate(`/cf/marketplace/companies/${company.companyId}`)
                }
              >
                <div className="flex items-start gap-3">
                  <span className="w-10 h-10 rounded-md bg-brand-soft text-brand flex items-center justify-center shrink-0">
                    <MdBusiness size={20} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold truncate text-app-text">
                      {company.companyName}
                    </h2>
                    <p className="text-xs text-app-sub mt-0.5">
                      {company.industry || "Industry not specified"}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-app-soft mt-3 line-clamp-2 min-h-[34px]">
                  {company.publicDescription ||
                    "Open portfolio to view products and business details."}
                </p>

                <p className="text-[11px] text-app-muted mt-3">{location}</p>

                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand"
                >
                  View Portfolio
                  <MdArrowForward size={14} />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MarketplaceCompaniesPage;
