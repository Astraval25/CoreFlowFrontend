import { useEffect, useState } from "react";
import { coreApi } from "../../../shared/services/coreApi";
import { jwtDecode } from "jwt-decode";

const RANGE_KEYS = {
  CURRENT_FY_YEAR: "current_fy_year",
  CURRENT_MONTH: "current_month",
  HALF: "half",
  QUARTER: "quarter",
  PREV_FY_YEAR: "prev_fy_year",
};

const getFiscalYear = () => {
  const today = new Date();
  const month = today.getMonth() + 1; // 1-indexed
  const year = today.getFullYear();
  // Fiscal year: April to March
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;
  return {
    startDate: `${startYear}-04-01`,
    endDate: `${endYear}-03-31`,
    startYear,
    endYear,
  };
};

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const getCurrentFiscalWindow = (today = new Date()) => {
  const fy = getFiscalYear();
  const fyStart = new Date(fy.startDate);
  const fyEnd = new Date(fy.endDate);
  return { fyStart, fyEnd };
};

const getDateRangeByPreset = (preset) => {
  const today = new Date();
  const year = today.getFullYear();
  const monthIdx = today.getMonth();
  const day = today.getDate();
  const { fyStart, fyEnd } = getCurrentFiscalWindow(today);

  if (preset === RANGE_KEYS.CURRENT_FY_YEAR) {
    return { startDate: formatDate(fyStart), endDate: formatDate(fyEnd) };
  }

  if (preset === RANGE_KEYS.CURRENT_MONTH) {
    const start = new Date(year, monthIdx, 1);
    return { startDate: formatDate(start), endDate: formatDate(today) };
  }

  if (preset === RANGE_KEYS.QUARTER) {
    const quarterStartMonth = Math.floor(monthIdx / 3) * 3;
    const start = new Date(year, quarterStartMonth, 1);
    return { startDate: formatDate(start), endDate: formatDate(today) };
  }

  if (preset === RANGE_KEYS.HALF) {
    const inFirstHalf = monthIdx <= 5; // Jan-Jun
    const start = new Date(year, inFirstHalf ? 0 : 6, 1);
    return { startDate: formatDate(start), endDate: formatDate(today) };
  }

  if (preset === RANGE_KEYS.PREV_FY_YEAR) {
    const { fyStart } = getCurrentFiscalWindow(today);
    const prevFyStart = new Date(fyStart.getFullYear() - 1, 3, 1); // Apr 1
    const prevFyEnd = new Date(fyStart.getFullYear(), 2, 31); // Mar 31
    return { startDate: formatDate(prevFyStart), endDate: formatDate(prevFyEnd) };
  }

  const defaultStart = new Date(year, monthIdx, day);
  return { startDate: formatDate(defaultStart), endDate: formatDate(today) };
};

export const useDashboard = ({
  cashFlowRange = RANGE_KEYS.CURRENT_FY_YEAR,
  revenueExpenseRange = RANGE_KEYS.CURRENT_FY_YEAR,
  topExpensesRange = RANGE_KEYS.CURRENT_FY_YEAR,
  summaryRange = RANGE_KEYS.CURRENT_FY_YEAR,
} = {}) => {
  const [kpi, setKpi] = useState(null);
  const [summaryKpi, setSummaryKpi] = useState(null);
  const [cashFlow, setCashFlow] = useState([]);
  const [revenueExpense, setRevenueExpense] = useState([]);
  const [graphKpi, setGraphKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summaryKpiLoading, setSummaryKpiLoading] = useState(true);
  const [cashFlowLoading, setCashFlowLoading] = useState(true);
  const [revenueExpenseLoading, setRevenueExpenseLoading] = useState(true);
  const [topExpensesLoading, setTopExpensesLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const fiscal = getFiscalYear();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setSummaryKpiLoading(false);
      setCashFlowLoading(false);
      setRevenueExpenseLoading(false);
      setTopExpensesLoading(false);
      return;
    }

    let decode = null;
    try {
      decode = jwtDecode(token);
    } catch (err) {
      console.error("Token decode failed:", err);
      setLoading(false);
      setSummaryKpiLoading(false);
      setCashFlowLoading(false);
      setRevenueExpenseLoading(false);
      setTopExpensesLoading(false);
      return;
    }

    const compId = decode?.defaultComp?.[0];
    const compName = decode?.defaultComp?.[1] || "";
    const name = decode?.name || decode?.sub || "";

    if (!compId) {
      setLoading(false);
      setSummaryKpiLoading(false);
      setCashFlowLoading(false);
      setRevenueExpenseLoading(false);
      setTopExpensesLoading(false);
      return;
    }

    setCompanyId(compId);
    setCompanyName(compName);
    setUserName(name);
  }, []);

  useEffect(() => {
    if (!companyId) return;

    setLoading(true);
    const { startDate, endDate } = fiscal;

    coreApi
      .getDashboardKpi(companyId, startDate, endDate)
      .then((kpiRes) => {
        setKpi(kpiRes.data.responseData);
      })
      .catch((err) => {
        console.error("Dashboard KPI API error:", err);
      })
      .finally(() => setLoading(false));
  }, [companyId, fiscal.startDate, fiscal.endDate]);

  useEffect(() => {
    if (!companyId) return;

    let cancelled = false;
    setSummaryKpiLoading(true);
    const summaryWindow = getDateRangeByPreset(summaryRange);

    coreApi
      .getDashboardKpi(companyId, summaryWindow.startDate, summaryWindow.endDate)
      .then((kpiRes) => {
        if (!cancelled) {
          setSummaryKpi(kpiRes.data.responseData || null);
        }
      })
      .catch((err) => {
        console.error("Dashboard summary KPI API error:", err);
      })
      .finally(() => {
        if (!cancelled) setSummaryKpiLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [companyId, summaryRange]);

  useEffect(() => {
    if (!companyId) return;

    let cancelled = false;
    setCashFlowLoading(true);
    const cashFlowWindow = getDateRangeByPreset(cashFlowRange);

    coreApi
      .getDashboardCashFlow(companyId, cashFlowWindow.startDate, cashFlowWindow.endDate)
      .then((cashFlowRes) => {
        if (!cancelled) {
          setCashFlow(cashFlowRes.data.responseData || []);
        }
      })
      .catch((err) => {
        console.error("Dashboard cash flow API error:", err);
      })
      .finally(() => {
        if (!cancelled) setCashFlowLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [companyId, cashFlowRange]);

  useEffect(() => {
    if (!companyId) return;

    let cancelled = false;
    setRevenueExpenseLoading(true);
    const revenueWindow = getDateRangeByPreset(revenueExpenseRange);

    coreApi
      .getDashboardRevenueExpense(companyId, revenueWindow.startDate, revenueWindow.endDate)
      .then((revExpRes) => {
        if (!cancelled) {
          setRevenueExpense(revExpRes.data.responseData || []);
        }
      })
      .catch((err) => {
        console.error("Dashboard revenue/expense API error:", err);
      })
      .finally(() => {
        if (!cancelled) setRevenueExpenseLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [companyId, revenueExpenseRange]);

  useEffect(() => {
    if (!companyId) return;

    let cancelled = false;
    setTopExpensesLoading(true);
    const topExpenseWindow = getDateRangeByPreset(topExpensesRange);

    coreApi
      .getDashboardKpi(companyId, topExpenseWindow.startDate, topExpenseWindow.endDate)
      .then((graphKpiRes) => {
        if (!cancelled) {
          setGraphKpi(graphKpiRes.data.responseData || null);
        }
      })
      .catch((err) => {
        console.error("Dashboard top expense KPI API error:", err);
      })
      .finally(() => {
        if (!cancelled) setTopExpensesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [companyId, topExpensesRange]);

  return {
    kpi,
    summaryKpi,
    cashFlow,
    revenueExpense,
    graphKpi,
    loading,
    summaryKpiLoading,
    cashFlowLoading,
    revenueExpenseLoading,
    topExpensesLoading,
    userName,
    companyName,
    fiscal,
    getDateRangeByPreset,
    RANGE_KEYS,
  };
};
