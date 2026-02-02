import { useState, useEffect } from "react";
import { coreApi } from "../../../shared/services/coreApi";

const useViewPurchaseDetail = (companyId, orderId) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      if (!companyId || !orderId) return;

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
    };

    fetchOrderDetail();
  }, [companyId, orderId]);

  return { order, loading, error };
};

export default useViewPurchaseDetail;