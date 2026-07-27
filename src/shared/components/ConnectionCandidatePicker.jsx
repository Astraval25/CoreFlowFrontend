import { useEffect, useMemo, useState } from "react";
import { MdBusiness, MdLinkOff, MdSearch } from "react-icons/md";
import { coreApi } from "../services/coreApi";

const compactDigits = (value) => String(value || "").replace(/\D/g, "");

const ConnectionCandidatePicker = ({
  companyId,
  phone,
  name,
  entityLabel,
  selectedCompany,
  offline,
  onSelectCompany,
  onCreateOffline,
}) => {
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultQuery = useMemo(() => {
    const phoneDigits = compactDigits(phone);
    if (phoneDigits.length >= 10) return phone;
    return name || "";
  }, [name, phone]);

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    const trimmed = query.trim();
    const phoneDigits = compactDigits(trimmed);
    if (!trimmed || (trimmed.length < 2 && phoneDigits.length < 10)) {
      setCandidates([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      coreApi
        .searchConnectionCandidates(trimmed, companyId)
        .then((res) => {
          if (!cancelled) setCandidates(res?.data?.responseData || []);
        })
        .catch(() => {
          if (!cancelled) setCandidates([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 350);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [companyId, query]);

  return (
    <div className="rounded-xl border border-line bg-app p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-app-sub">CoreFlow Company Match</p>
          <p className="mt-1 text-[11px] leading-relaxed text-app-muted">
            Search by phone or company name. Select a match to send a connection request, or create offline if no match is correct.
          </p>
        </div>
        {(selectedCompany || offline) && (
          <span className={`badge ${offline ? "badge-gray" : "badge-blue"}`}>
            {offline ? "Offline" : "Will request"}
          </span>
        )}
      </div>

      <div className="relative">
        <MdSearch className="pointer-events-none absolute left-3 top-2.5 text-app-muted" size={15} />
        <input
          className="form-input pl-9 text-xs"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${entityLabel} company by phone or name`}
        />
      </div>

      {selectedCompany && (
        <div className="mt-3 rounded-lg border border-brand-border bg-brand-soft p-3">
          <p className="text-xs font-bold text-brand">{selectedCompany.companyName}</p>
          <p className="mt-1 text-[11px] text-app-sub">
            This {entityLabel} will be created with a pending connection request.
          </p>
        </div>
      )}

      <div className="mt-3 space-y-2">
        {loading && <p className="text-xs text-app-sub">Searching...</p>}
        {!loading && candidates.length === 0 && query.trim() && (
          <p className="text-xs text-app-sub">No matching CoreFlow company found.</p>
        )}
        {candidates.map((company) => (
          <button
            key={company.companyId}
            type="button"
            className="w-full rounded-lg border border-line bg-surface p-3 text-left transition hover:border-brand hover:bg-surface-muted"
            onClick={() => onSelectCompany(company)}
          >
            <span className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-brand">
                <MdBusiness size={16} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold text-app-text">{company.companyName}</span>
                <span className="mt-1 block text-[11px] text-app-sub">
                  {[company.shortName, company.industry].filter(Boolean).join(" | ") || "CoreFlow company"}
                </span>
              </span>
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className="btn-ghost mt-3 w-full justify-center text-xs"
        onClick={onCreateOffline}
      >
        <MdLinkOff size={14} />
        No match is correct, create offline
      </button>
    </div>
  );
};

export default ConnectionCandidatePicker;
