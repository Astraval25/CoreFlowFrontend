import {
  MdFolder,
  MdMoreVert,
  MdSearch,
} from "react-icons/md";

const ReportCenterListView = ({
  searchText,
  setSearchText,
  activeView,
  setActiveView,
  activeCategory,
  setActiveCategory,
  viewFilters,
  categoryList,
  visibleReports,
  error,
  onSelectReport,
}) => {
  return (
    <>
      <div className="px-5 py-4 flex items-center justify-between border-b border-line bg-surface">
        <h1 className="text-3xl font-semibold text-app-text">Reports Center</h1>

        <div className="relative w-full max-w-md mx-4">
          <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-app-muted" />
          <input
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm border border-line bg-surface-soft text-app-heading"
            placeholder="Search reports"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <button className="w-9 h-9 rounded-lg flex items-center justify-center border border-brand-field-border bg-surface">
          <MdMoreVert size={20} className="text-app-sub" />
        </button>
      </div>

      <div className="flex gap-0 h-[calc(100vh-190px)] min-h-[640px]">
        <aside className="w-[270px] shrink-0 p-4 overflow-auto bg-surface-muted border-r border-line">
          <div className="space-y-1 mb-8">
            {viewFilters.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm"
                onClick={() => setActiveView(id)}
                style={{
                  background: activeView === id ? "var(--accent-soft)" : "transparent",
                  color: activeView === id ? "var(--accent)" : "var(--text-heading)",
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide mb-3 text-app-sub">
            Report Category
          </p>

          <button
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1"
            onClick={() => setActiveCategory("All")}
            style={{
              background: activeCategory === "All" ? "var(--accent-soft)" : "transparent",
              color: activeCategory === "All" ? "var(--accent)" : "var(--text-heading)",
            }}
          >
            <span className="inline-flex items-center gap-2"><MdFolder size={18} />All</span>
          </button>

          <div className="space-y-1">
            {categoryList.map((category) => (
              <button
                key={category}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm"
                onClick={() => setActiveCategory(category)}
                style={{
                  background: activeCategory === category ? "var(--accent-soft)" : "transparent",
                  color: activeCategory === category ? "var(--accent)" : "var(--text-heading)",
                }}
              >
                <span className="inline-flex items-center gap-2"><MdFolder size={18} />{category}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex-1 p-4 overflow-auto bg-surface">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-2xl font-semibold text-app-text">All Reports</h2>
            <span className="text-xs px-2 py-1 rounded-full font-bold bg-brand-secondary-bg text-brand-secondary">
              {visibleReports.length}
            </span>
          </div>

          {error && (
            <div className="mb-3 px-3 py-2 rounded text-sm border border-danger-alert-border bg-danger-alert-bg text-danger-alert-text">
              {error}
            </div>
          )}

          <div className="rounded-xl overflow-hidden border border-line">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="border-b border-line bg-surface-muted">
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-app-sub">Report Name</th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-app-sub">Report Category</th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-app-sub">Created By</th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide text-app-sub">Last Visited</th>
                </tr>
              </thead>
              <tbody>
                {visibleReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => onSelectReport(report.id)}
                    className="cursor-pointer border-b border-line-soft"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--surface-hover)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--surface-bg)";
                    }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-brand-hover">{report.name}</td>
                    <td className="px-4 py-3 text-sm text-app-text">{report.category}</td>
                    <td className="px-4 py-3 text-sm text-app-text">{report.createdBy}</td>
                    <td className="px-4 py-3 text-sm text-app-text">{report.lastVisited}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
};

export default ReportCenterListView;
