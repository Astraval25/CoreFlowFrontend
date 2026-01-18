import { useState, useEffect } from "react";
import { coreApi } from "../../../shared/services/coreApi";

const useViewVendorDetail = (companyId, vendorId) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId || !vendorId) return;

    const fetchVendor = async () => {
      setLoading(true);
      try {
        const res = await coreApi.getVendorDetail(companyId, vendorId);
        if (res.data.responseStatus) {
          setVendor(res.data.responseData);
          console.log(res);
        } else {
          setError("Failed to fetch vendor details");
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [companyId, vendorId]);

  return { vendor, loading, error };
};

export default useViewVendorDetail;
