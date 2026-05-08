import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { MdHome, MdOutlineFavoriteBorder } from "react-icons/md";
import { useParams } from "react-router-dom";
import { coreApi } from "../../../shared/services/coreApi";
import ReportCenterListView from "../components/ReportCenterListView";
import ReportDetailView from "../components/ReportDetailView";

const getFiscalYear = () => {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;
  return {
    startDate: `${startYear}-04-01`,
    endDate: `${endYear}-03-31`,
  };
};

const REPORT_CATALOG = [
  { id: "dashboardRevenueExpense", name: "Profit and Loss", category: "Business Overview", createdBy: "System Generated" },
  { id: "dashboardCashFlow", name: "Cash Flow Statement", category: "Business Overview", createdBy: "System Generated" },
  { id: "dashboardKpi", name: "Business Performance Ratios", category: "Business Overview", createdBy: "System Generated" },
  { id: "salesByCustomer", name: "Sales by Customer", category: "Sales", createdBy: "System Generated" },
  { id: "salesByItem", name: "Sales by Item", category: "Sales", createdBy: "System Generated" },
  { id: "salesSummary", name: "Sales Summary", category: "Sales", createdBy: "System Generated" },
  { id: "salesOrderFrequency", name: "Sales Order Frequency", category: "Sales", createdBy: "System Generated" },
  { id: "purchaseByVendor", name: "Purchase by Vendor", category: "Purchases and Expenses", createdBy: "System Generated" },
  { id: "purchaseByItem", name: "Purchase by Item", category: "Purchases and Expenses", createdBy: "System Generated" },
  { id: "purchaseSummary", name: "Purchase Summary", category: "Purchases and Expenses", createdBy: "System Generated" },
  { id: "paymentModeDistribution", name: "Payment Mode Distribution", category: "Banking", createdBy: "System Generated" },
  { id: "salesPaymentFrequency", name: "Payments Received Frequency", category: "Payments Received", createdBy: "System Generated" },
  { id: "purchasePaymentFrequency", name: "Payments Made Frequency", category: "Payables", createdBy: "System Generated" },
  { id: "topSellingItems", name: "Top Selling Items", category: "Inventory", createdBy: "System Generated" },
  { id: "topProfitableItems", name: "Top Profitable Items", category: "Inventory", createdBy: "System Generated" },
  { id: "profitByItem", name: "Profit by Item", category: "Inventory", createdBy: "System Generated" },
  { id: "monthlyTrend", name: "Monthly Trend", category: "Business Overview", createdBy: "System Generated" },
  { id: "salesItemFrequency", name: "Sales Item Frequency", category: "Sales", createdBy: "System Generated" },
  { id: "purchaseItemFrequency", name: "Purchase Item Frequency", category: "Purchases and Expenses", createdBy: "System Generated" },
  { id: "salesRunningOrderAmount", name: "Sales Running Order Amount", category: "Sales", createdBy: "System Generated" },
  { id: "purchaseRunningOrderAmount", name: "Purchase Running Order Amount", category: "Purchases and Expenses", createdBy: "System Generated" },
  { id: "salesRunningPaymentAmount", name: "Sales Running Payment Amount", category: "Payments Received", createdBy: "System Generated" },
  { id: "purchaseRunningPaymentAmount", name: "Purchase Running Payment Amount", category: "Payables", createdBy: "System Generated" },
];

const CATEGORY_LIST = [
  "Business Overview",
  "Sales",
  "Inventory",
  "Payments Received",
  "Payables",
  "Purchases and Expenses",
  "Banking",
];

const REPORT_TYPE_TO_CATEGORY = {
  customers: "Sales",
  vendors: "Purchases and Expenses",
  items: "Inventory",
  sales: "Sales",
  purchase: "Purchases and Expenses",
  "payment-received": "Payments Received",
  "payment-made": "Payables",
};

const VIEW_FILTERS = [
  { id: "home", label: "Home", icon: MdHome },
  { id: "favorites", label: "Favorites", icon: MdOutlineFavoriteBorder },
];

const formatDatePretty = (dateString) => {
  if (!dateString) return "-";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) return dateString;
  return `${day}/${month}/${year}`;
};

const formatLastVisited = () => {
  const now = new Date();
  return `${now.toLocaleDateString("en-GB")} ${now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
};

const ReportPage = ({ reportType = "" }) => {
  const { companyId } = useParams();
  const fiscal = getFiscalYear();

  const [startDate, setStartDate] = useState(fiscal.startDate);
  const [endDate, setEndDate] = useState(fiscal.endDate);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({});
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState(REPORT_TYPE_TO_CATEGORY[reportType] || "All");
  const [activeView, setActiveView] = useState("home");
  const [selectedReportId, setSelectedReportId] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [companyName, setCompanyName] = useState("Company");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setCompanyName(decoded?.defaultComp?.[1] || "Company");
    } catch {
      setCompanyName("Company");
    }
  }, []);

  useEffect(() => {
    setActiveCategory(REPORT_TYPE_TO_CATEGORY[reportType] || "All");
  }, [reportType]);

  const allCalls = useMemo(
    () => ({
      dashboardKpi: () => coreApi.getDashboardKpi(companyId, startDate, endDate),
      dashboardCashFlow: () => coreApi.getDashboardCashFlow(companyId, startDate, endDate),
      dashboardRevenueExpense: () => coreApi.getDashboardRevenueExpense(companyId, startDate, endDate),
      salesSummary: () => coreApi.getSalesSummary(companyId, startDate, endDate),
      purchaseSummary: () => coreApi.getPurchaseSummary(companyId, startDate, endDate),
      salesOrderFrequency: () => coreApi.getSalesOrderFrequency(companyId, startDate, endDate),
      purchaseOrderFrequency: () => coreApi.getPurchaseOrderFrequency(companyId, startDate, endDate),
      salesPaymentFrequency: () => coreApi.getSalesPaymentFrequency(companyId, startDate, endDate),
      purchasePaymentFrequency: () => coreApi.getPurchasePaymentFrequency(companyId, startDate, endDate),
      salesItemFrequency: () => coreApi.getSalesItemFrequency(companyId, startDate, endDate),
      purchaseItemFrequency: () => coreApi.getPurchaseItemFrequency(companyId, startDate, endDate),
      salesRunningOrderAmount: () => coreApi.getSalesRunningOrderAmount(companyId, startDate, endDate),
      purchaseRunningOrderAmount: () => coreApi.getPurchaseRunningOrderAmount(companyId, startDate, endDate),
      salesRunningPaymentAmount: () => coreApi.getSalesRunningPaymentAmount(companyId, startDate, endDate),
      purchaseRunningPaymentAmount: () => coreApi.getPurchaseRunningPaymentAmount(companyId, startDate, endDate),
      salesByCustomer: () => coreApi.getSalesByCustomer(companyId, startDate, endDate),
      purchaseByVendor: () => coreApi.getPurchaseByVendor(companyId, startDate, endDate),
      salesByItem: () => coreApi.getSalesByItem(companyId, startDate, endDate),
      purchaseByItem: () => coreApi.getPurchaseByItem(companyId, startDate, endDate),
      profitByItem: () => coreApi.getProfitByItem(companyId, startDate, endDate),
      topSellingItems: () => coreApi.getTopSellingItems(companyId, startDate, endDate),
      topProfitableItems: () => coreApi.getTopProfitableItems(companyId, startDate, endDate),
      paymentModeDistribution: () => coreApi.getPaymentModeDistribution(companyId, startDate, endDate),
      monthlyTrend: () => coreApi.getMonthlyTrend(companyId, startDate, endDate),
    }),
    [companyId, startDate, endDate]
  );

  const loadReports = async () => {
    if (!companyId) return;

    setLoading(true);
    setError("");

    const entries = Object.entries(allCalls);
    const results = await Promise.allSettled(entries.map(([, caller]) => caller()));

    const nextData = {};
    const failedSections = [];

    results.forEach((result, index) => {
      const [key] = entries[index];
      if (result.status === "fulfilled") {
        nextData[key] = result.value?.data?.responseData ?? null;
      } else {
        nextData[key] = null;
        failedSections.push(key);
      }
    });

    setData(nextData);
    if (failedSections.length) {
      setError(`Some sections failed to load: ${failedSections.join(", ")}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadReports();
  }, [allCalls]);

  const allReports = useMemo(
    () =>
      REPORT_CATALOG.map((report) => ({
        ...report,
        lastVisited: data[report.id] ? formatLastVisited() : "-",
      })),
    [data]
  );

  const visibleReports = useMemo(() => {
    const byCategory =
      activeCategory === "All"
        ? allReports
        : allReports.filter((report) => report.category === activeCategory);

    const text = searchText.trim().toLowerCase();
    if (!text) return byCategory;

    return byCategory.filter((report) => {
      return (
        report.name.toLowerCase().includes(text) ||
        report.category.toLowerCase().includes(text)
      );
    });
  }, [allReports, activeCategory, searchText]);

  const selectedReport = useMemo(() => {
    if (selectedReportId) {
      return REPORT_CATALOG.find((report) => report.id === selectedReportId) || null;
    }
    return visibleReports[0] || null;
  }, [selectedReportId, visibleReports]);

  useEffect(() => {
    if (!selectedReport && visibleReports.length) {
      setSelectedReportId(visibleReports[0].id);
    }
  }, [selectedReport, visibleReports]);

  const selectedReportData = selectedReport ? data[selectedReport.id] : null;

  return (
    <div className="min-h-[calc(100vh-90px)] bg-app">
      {!detailOpen ? (
        <ReportCenterListView
          searchText={searchText}
          setSearchText={setSearchText}
          activeView={activeView}
          setActiveView={setActiveView}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          viewFilters={VIEW_FILTERS}
          categoryList={CATEGORY_LIST}
          visibleReports={visibleReports}
          error={error}
          onSelectReport={(id) => {
            setSelectedReportId(id);
            setDetailOpen(true);
          }}
        />
      ) : (
        <ReportDetailView
          selectedReport={selectedReport}
          selectedReportData={selectedReportData}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          loadReports={loadReports}
          loading={loading}
          error={error}
          companyName={companyName}
          formatDatePretty={formatDatePretty}
          onBack={() => setDetailOpen(false)}
        />
      )}
    </div>
  );
};

export default ReportPage;
