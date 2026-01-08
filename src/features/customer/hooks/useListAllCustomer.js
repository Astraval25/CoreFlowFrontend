import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const useListAllCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found");
      setLoading(false);
      return;
    }

    const decoded = jwtDecode(token);
    const companyId = decoded?.defaultComp?.[0];

    if (!companyId) {
      setError("Company ID not found");
      setLoading(false);
      return;
    }

    coreApi
      .getAllCustomerByCompanyId(companyId)
      .then((res) => {
        console.log("Customers:", res.data.responseData);
        setCustomers(res.data.responseData);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { customers, loading, error };
};

export default useListAllCustomer;
