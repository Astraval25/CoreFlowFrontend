import { useCallback, useEffect, useState } from "react";
import { coreApi } from "../../shared/services/coreApi";

const useCompanyDrawer = () => {
  const [companies, setCompanies] = useState([]);
  const [uploadingId, setUploadingId] = useState(null);

  const loadCompanies = useCallback(() => {
    coreApi
      .getMyCompanies()
      .then((res) => {
        setCompanies(res.data.responseData);
      })
      .catch((err) => {
        console.error("Failed to fetch companies:", err);
      });
  }, []);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  const uploadLogo = useCallback(
    async (companyId, file) => {
      if (!file) return;
      setUploadingId(companyId);
      try {
        await coreApi.uploadCompanyLogo(companyId, file);
        loadCompanies();
      } catch (err) {
        console.error("Failed to upload logo:", err);
      } finally {
        setUploadingId(null);
      }
    },
    [loadCompanies]
  );

  return { companies, uploadLogo, uploadingId, reload: loadCompanies };
};
export default useCompanyDrawer;
