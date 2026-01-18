import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const useListAllVendor = () => {
  const [vendors, setVendors] = useState([]);
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
      .getAllVendorByCompanyId(companyId)
      .then((res) => {
        console.log("Vendors:", res.data.responseData);
        setVendors(res.data.responseData);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { vendors, loading, error };
};

export default useListAllVendor;
