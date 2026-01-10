import { useState, useEffect } from "react";
import { coreApi } from "../../../shared/services/coreApi";

const useViewCustomerDetail = (companyId, customerId) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId || !customerId) return;

    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const res = await coreApi.getCustomerDetail(companyId, customerId);
        if (res.data.responseStatus) {
          setCustomer(res.data.responseData);
          console.log(res)
        } else {
          setError("Failed to fetch customer details");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [companyId, customerId]);

  return { customer, loading, error };
};

export default useViewCustomerDetail;
