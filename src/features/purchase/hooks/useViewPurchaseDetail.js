import { useState, useEffect, useCallback } from "react";
import { coreApi } from "../../../shared/services/coreApi";
import { emitAppError } from "../../../shared/utils/appError";

const useViewPurchaseDetail = (companyId, orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
    if (!companyId || !orderId) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await coreApi.getPurchaseDetail(companyId, orderId);
      setOrder(response.data.responseData);
    } catch (err) {
      setError("Failed to load order details");
      console.error("Error fetching order detail:", err);
    } finally {
      setLoading(false);
    }
  }, [companyId, orderId]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const transition = async (apiFn) => {
    if (!companyId || !orderId) return;
    setStatusUpdating(true);
    try {
      await apiFn(companyId, orderId);
      await fetchOrderDetail();
    } catch (err) {
      console.error("Status update failed:", err);
      emitAppError(err, "Status update failed");
    } finally {
      setStatusUpdating(false);
    }
  };

  return {
    order,
    loading,
    error,
    statusUpdating,
    convertToOrder: () => transition(coreApi.updateOrderStatusSalesOrder),
    convertToBill: () => transition(coreApi.updateOrderStatusInvoiced),
    markPaid: () => transition(coreApi.updateOrderStatusPaid),
    acceptQuotation: () => transition(coreApi.updateOrderStatusQuotationAccepted),
    declineQuotation: () => transition(coreApi.updateOrderStatusQuotationDeclined),
    cancelOrder: () => transition(coreApi.cancelOrder),
  };
};

export default useViewPurchaseDetail;
