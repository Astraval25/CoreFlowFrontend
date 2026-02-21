import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const useListAllSales = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const companyId = decoded?.defaultComp?.[0];

        const response = await coreApi.getAllSales(companyId);
        setOrders(response.data.responseData || []);
      } catch (err) {
        setError(err);
        console.error("Error fetching sales orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading, error };
};

export default useListAllSales;
