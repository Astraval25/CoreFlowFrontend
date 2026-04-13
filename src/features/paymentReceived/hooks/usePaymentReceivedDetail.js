import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const usePaymentReceivedDetail = (paymentId) => {
  const [companyId, setCompanyId] = useState("");
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  const decodeCompanyId = () => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    const decoded = jwtDecode(token);
    return decoded?.defaultComp?.[0] || "";
  };

  const fetchPayment = async (compId, pid) => {
    if (!compId || !pid) return;
    setLoading(true);
    try {
      const res = await coreApi.getPaymentDetail(compId, pid);
      setPayment(res?.data?.responseData || null);
    } catch (error) {
      console.error("Failed to fetch payment detail:", error);
      setPayment(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const compId = decodeCompanyId();
    if (!compId) return;
    setCompanyId(compId);
    fetchPayment(compId, paymentId);
  }, [paymentId]);

  const updateStatus = async (statusType) => {
    if (!companyId || !paymentId) return false;

    try {
      const statusCallMap = {
        paid: coreApi.updatePaymentStatusPaid,
        viewed: coreApi.updatePaymentStatusViewed,
        failed: coreApi.updatePaymentStatusFailed,
        refund: coreApi.updatePaymentStatusRefund,
        partiallyPaid: coreApi.updatePaymentStatusPartiallyPaid,
      };
      const apiCall = statusCallMap[statusType];
      if (!apiCall) return false;
      await apiCall(companyId, paymentId);
      await fetchPayment(companyId, paymentId);
      return true;
    } catch (error) {
      alert(error?.response?.data?.responseMessage || "Failed to update payment status");
      return false;
    }
  };

  return {
    companyId,
    payment,
    loading,
    refresh: () => fetchPayment(companyId, paymentId),
    updateStatus,
  };
};

export default usePaymentReceivedDetail;
