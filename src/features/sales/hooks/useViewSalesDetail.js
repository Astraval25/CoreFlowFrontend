import { useState, useEffect } from "react";
import { coreApi } from "../../../shared/services/coreApi";

const useViewSalesDetail = (companyId, orderId) => {
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId || !orderId) {
      setLoading(false);
      return;
    }

    const fetchOrderDetail = async () => {
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
    };

    fetchOrderDetail();
  }, [companyId, orderId]);

  return { order, orderItems, loading, error };
};

export default useViewSalesDetail;
