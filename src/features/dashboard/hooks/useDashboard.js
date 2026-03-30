import { useEffect, useState } from "react";
import { coreApi } from "../../../shared/services/coreApi";
import { jwtDecode } from "jwt-decode";

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

export const useDashboard = () => {
  const [kpi, setKpi] = useState(null);
  const [cashFlow, setCashFlow] = useState([]);
  const [revenueExpense, setRevenueExpense] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const fiscal = getFiscalYear();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const compId = decode.defaultComp[0];
    const compName = decode.defaultComp[1] || "";
    const name = decode.name || decode.sub || "";

    setCompanyName(compName);
    setUserName(name);

    const { startDate, endDate } = fiscal;

    Promise.all([
      coreApi.getDashboardKpi(compId, startDate, endDate),
      coreApi.getDashboardCashFlow(compId, startDate, endDate),
      coreApi.getDashboardRevenueExpense(compId, startDate, endDate),
    ])
      .then(([kpiRes, cashFlowRes, revExpRes]) => {
        setKpi(kpiRes.data.responseData);
        setCashFlow(cashFlowRes.data.responseData || []);
        setRevenueExpense(revExpRes.data.responseData || []);
      })
      .catch((err) => {
        console.error("Dashboard API error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { kpi, cashFlow, revenueExpense, loading, userName, companyName, fiscal };
};
