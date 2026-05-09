import useSalesPage from "../hooks/useSalesPage";
import { MdAdd, MdSearch, MdInbox } from "react-icons/md";
import { flexRender } from "@tanstack/react-table";
import { useNavigate, useSearchParams } from "react-router-dom";
import ActionMenu from "../../../shared/components/ActionMenu";
import { useEffect, useState } from "react";

const TABS = [
  { id: "report", label: "Report" },
  { id: "quotes", label: "Quotes" },
  { id: "salesOrder", label: "Sales Order" },
  { id: "invoice", label: "Invoices" },
  { id: "payReceived", label: "Pay Received" },
];

const SalesPage = () => {
  const {
    companyId, allSales, table,
    globalFilter, setGlobalFilter,
    deactivateSalesOrder, activateSalesOrder,
  } = useSalesPage();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const validTabs = TABS.map((t) => t.id);
  const initialTab = validTabs.includes(tabParam) ? tabParam : "quotes";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    if (tabParam && validTabs.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab, validTabs]);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setSearchParams({ tab: id });
  };

  const createPath = () => {
    const typeMap = { quotes: "quote", salesOrder: "order", invoice: "invoice" };
    const orderType = typeMap[activeTab] || "quote";
    return `/cf/company/${companyId}/sales/create?type=${orderType}`;
  };

  const filterByStatus = (statuses) => allSales.filter((s) => statuses.includes(s.orderStatus));

  const getFilteredSales = () => {
    switch (activeTab) {
      case "quotes":
        return filterByStatus(["QUOTATION", "QUOTATION_VIEWED", "QUOTATION_ACCEPTED", "QUOTATION_DECLINED"]);
      case "salesOrder":
        return filterByStatus(["ORDER", "ORDER_VIEWED"]);
      case "invoice":
        return filterByStatus(["ORDER_INVOICED", "ORDER_PAYED"]);
      default:
        return [];
    }
  };

  const filteredSales = getFilteredSales();

  return (
    <div className="min-h-screen bg-app">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-6">
          <h1 className="text-sm font-bold text-app-text">Sales</h1>
          <div className="flex items-center gap-5">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "payReceived") {
                    navigate(`/cf/company/${companyId}/payment-received/list`);
                    return;
                  }
                  handleTabChange(tab.id);
                }}
                className="text-xs pb-1 border-b-2 transition-colors"
                style={{
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  color: activeTab === tab.id ? "var(--accent)" : "var(--text-sub)",
                  borderColor: activeTab === tab.id ? "var(--accent)" : "transparent",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-app-muted"
            />
            <input
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search orders..."
              className="form-input pl-8 text-xs py-1.5"
              style={{ width: 220 }}
            />
          </div>
          <button className="btn-primary text-xs" onClick={() => navigate(createPath())}>
            <MdAdd size={15} /> New
          </button>
        </div>
      </div>

      <div className="p-4 bg-surface">
        <div className="rounded-xl overflow-hidden border border-line">
          <table className="w-full min-w-[980px]">
          <thead>
            <tr className="border-b border-line bg-surface-muted">
              {table.getHeaderGroups().map((hg) =>
                hg.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="px-5 py-3 text-left cursor-pointer select-none text-[11px] font-bold uppercase tracking-[0.05em] text-app-sub"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <MdInbox size={28} className="text-app-sub" />
                    <p className="text-sm text-app-sub">No orders found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSales.map((order, index) => (
                <tr
                  key={order.orderId}
                  className="cursor-pointer border-b border-line-soft"
                  
                  onClick={() => navigate(`/cf/company/${companyId}/sales/${order.orderId}/detail`)}
                >
                  <td className="px-5 py-3 text-sm text-app-sub">{index + 1}</td>
                  <td className="px-5 py-3 text-sm font-medium text-brand-hover">{order.orderNumber}</td>
                  <td className="px-5 py-3 text-sm text-app-text">{order.orderDate}</td>
                  <td className="px-5 py-3 text-sm text-app-text">{order.sellerCompanyName}</td>
                  <td className="px-5 py-3 text-sm text-app-text">{order.customerName}</td>
                  <td className="px-5 py-3 text-sm font-medium tabular-nums text-app-text">Rs {order.totalAmount}</td>
                  <td className="px-5 py-3 text-sm font-medium tabular-nums text-app-text">Rs {order.paidAmount}</td>
                  <td className="px-5 py-3">
                    <span className="badge badge-blue">{order.orderStatus}</span>
                  </td>
                  <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                    <ActionMenu
                      row={{ original: order }}
                      onEdit={() => navigate(`/cf/company/${companyId}/sales/${order.orderId}/update`)}
                      onDelete={() => { if (window.confirm("Deactivate this order?")) deactivateSalesOrder(order.orderId); }}
                      onActivate={() => { if (window.confirm("Activate this order?")) activateSalesOrder(order.orderId); }}
                    />
                  </td>
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

export default SalesPage;
