import { useState, useEffect } from "react";
import { coreApi } from "../../../shared/services/coreApi";
import { jwtDecode } from "jwt-decode";

const useListAllItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const compId = decoded?.defaultComp?.[0];
      setCompanyId(compId);
    } catch (err) {
      console.error("Invalid token", err);
      setError("Invalid authentication");
    }
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      if (!companyId) return;

      try {
        setLoading(true);
        const response = await coreApi.getItems(companyId);
        setItems(response.data.responseData || []);
      } catch (err) {
        setError("Failed to load items");
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [companyId]);

  return { items, loading, error };
};

export default useListAllItems;