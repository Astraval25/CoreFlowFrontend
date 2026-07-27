import { useState, useEffect, useCallback } from "react";
import { coreApi } from "../../../shared/services/coreApi";
import { emitAppError } from "../../../shared/utils/appError";

const useViewSalesDetail = (companyId, orderId) => {
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
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
      const response = await coreApi.getSalesDetails(companyId, orderId);
      const data = response.data.responseData;
      setOrder(data);
      setOrderItems(data.orderItems || []);
    } catch (err) {
      setError(err);
      console.error("Error fetching order details:", err);
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
    orderItems,
    loading,
    error,
    statusUpdating,
    convertToSalesOrder: () => transition(coreApi.updateOrderStatusSalesOrder),
    convertToInvoice: () => transition(coreApi.updateOrderStatusInvoiced),
    markPaid: () => transition(coreApi.updateOrderStatusPaid),
    acceptQuotation: () => transition(coreApi.updateOrderStatusQuotationAccepted),
    declineQuotation: () => transition(coreApi.updateOrderStatusQuotationDeclined),
    cancelOrder: () => transition(coreApi.cancelOrder),
  };
};

export default useViewSalesDetail;
