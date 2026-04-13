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
      <div className="px-5 py-4 flex items-center justify-between" style={{ background: "#ffffff", borderBottom: "1px solid #e5e7ef" }}>
        <h1 className="text-3xl font-semibold" style={{ color: "#1f2b46" }}>Reports Center</h1>

        <div className="relative w-full max-w-md mx-4">
          <MdSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#7684a8" }} />
          <input
            className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
            placeholder="Search reports"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ background: "#f1f3f9", border: "1px solid #e3e7f1", color: "#23314f" }}
          />
        </div>

        <button className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ border: "1px solid #d8deed", background: "#fff" }}>
          <MdMoreVert size={20} style={{ color: "#5e6d91" }} />
        </button>
      </div>

      <div className="flex gap-0 h-[calc(100vh-190px)] min-h-[640px]">
        <aside className="w-[270px] shrink-0 p-4 overflow-auto" style={{ background: "#f7f8fc", borderRight: "1px solid #e3e7f1" }}>
          <div className="space-y-1 mb-8">
            {viewFilters.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm"
                onClick={() => setActiveView(id)}
                style={{
                  background: activeView === id ? "#e9eefc" : "transparent",
                  color: activeView === id ? "#1849b8" : "#2d3b5f",
                }}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#6b7898" }}>
            Report Category
          </p>

          <button
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm mb-1"
            onClick={() => setActiveCategory("All")}
            style={{
              background: activeCategory === "All" ? "#e9eefc" : "transparent",
              color: activeCategory === "All" ? "#1849b8" : "#2d3b5f",
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
                  background: activeCategory === category ? "#e9eefc" : "transparent",
                  color: activeCategory === category ? "#1849b8" : "#2d3b5f",
                }}
              >
                <span className="inline-flex items-center gap-2"><MdFolder size={18} />{category}</span>
              </button>
            ))}
          </div>
        </aside>

        <section className="flex-1 p-4 overflow-auto" style={{ background: "#ffffff" }}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-2xl font-semibold" style={{ color: "#1f2b46" }}>All Reports</h2>
            <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: "#e8efff", color: "#2f5bd2" }}>
              {visibleReports.length}
            </span>
          </div>

          {error && (
            <div className="mb-3 px-3 py-2 rounded text-sm" style={{ background: "#fff1f2", border: "1px solid #fecdd3", color: "#be123c" }}>
              {error}
            </div>
          )}

          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e3e7f1" }}>
            <table className="w-full min-w-[780px]">
              <thead>
                <tr style={{ background: "#f7f8fc", borderBottom: "1px solid #e3e7f1" }}>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide" style={{ color: "#6a7693" }}>Report Name</th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide" style={{ color: "#6a7693" }}>Report Category</th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide" style={{ color: "#6a7693" }}>Created By</th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wide" style={{ color: "#6a7693" }}>Last Visited</th>
                </tr>
              </thead>
              <tbody>
                {visibleReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => onSelectReport(report.id)}
                    className="cursor-pointer"
                    style={{ borderBottom: "1px solid #edf1f8" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f8faff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#ffffff";
                    }}
                  >
                    <td className="px-4 py-3 text-sm font-medium" style={{ color: "#1b5fcc" }}>{report.name}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "#202c45" }}>{report.category}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "#202c45" }}>{report.createdBy}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "#202c45" }}>{report.lastVisited}</td>
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
