import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const usePaymentMadePage = () => {
  const [companyId, setCompanyId] = useState("");
  const [payments, setPayments] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPayments = async (compId) => {
    setLoading(true);
    try {
      const res = await coreApi.getPaymentsSentSummary(compId);
      setPayments(res?.data?.responseData || []);
    } catch (error) {
      console.error("Failed to fetch payment summary:", error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const decoded = jwtDecode(token);
    const compId = decoded?.defaultComp?.[0];
    if (!compId) return;
    setCompanyId(compId);
    fetchPayments(compId);
  }, []);

  const filteredPayments = useMemo(() => {
    const q = (globalFilter || "").trim().toLowerCase();
    if (!q) return payments;
    return payments.filter((p) => {
      return (
        String(p.paymentNumber || "").toLowerCase().includes(q) ||
        String(p.platformRef || "").toLowerCase().includes(q) ||
        String(p.vendorName || "").toLowerCase().includes(q) ||
        String(p.orderIds || "").toLowerCase().includes(q) ||
        String(p.paymentStatus || "").toLowerCase().includes(q) ||
        String(p.modeOfPayment || "").toLowerCase().includes(q)
      );
    });
  }, [payments, globalFilter]);

  return {
    companyId,
    payments,
    filteredPayments,
    globalFilter,
    setGlobalFilter,
    loading,
    refreshPayments: () => fetchPayments(companyId),
  };
};

export default usePaymentMadePage;
