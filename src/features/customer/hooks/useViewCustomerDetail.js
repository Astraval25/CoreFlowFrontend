import { useCallback, useEffect, useState } from "react";
import { coreApi } from "../../../shared/services/coreApi";

const useViewCustomerDetail = (companyId, customerId) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomer = useCallback(async () => {
    if (!companyId || !customerId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await coreApi.getCustomerDetail(companyId, customerId);
      if (res.data.responseStatus) {
        setCustomer(res.data.responseData);
      } else {
        setError("Failed to fetch customer details");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [companyId, customerId]);

  useEffect(() => {
    fetchCustomer();
  }, [fetchCustomer]);

  return { customer, loading, error, refreshCustomer: fetchCustomer };
};

export default useViewCustomerDetail;
