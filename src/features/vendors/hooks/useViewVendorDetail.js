import { useCallback, useEffect, useState } from "react";
import { coreApi } from "../../../shared/services/coreApi";

const useViewVendorDetail = (companyId, vendorId) => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendor = useCallback(async () => {
    if (!companyId || !vendorId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await coreApi.getVendorDetail(companyId, vendorId);
      if (res.data.responseStatus) {
        setVendor(res.data.responseData);
      } else {
        setError("Failed to fetch vendor details");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [companyId, vendorId]);

  useEffect(() => {
    fetchVendor();
  }, [fetchVendor]);

  return { vendor, loading, error, refreshVendor: fetchVendor };
};

export default useViewVendorDetail;
