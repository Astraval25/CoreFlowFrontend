import { useState, useEffect } from "react";
import { coreApi } from "../../../shared/services/coreApi";

const useViewWorkDef = (companyId, workDefId) => {
  const [workDef, setWorkDef] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkDef = async () => {
      setLoading(true);

      try {
        const response = await coreApi.getWorkDefinitionDetail(
          companyId,
          workDefId
        );

        setWorkDef(response.data.responseData);
      } catch (err) {
        console.error("Fetch work definition detail error:", err);

        setError(
          err.response?.data?.responseMessage ||
            "Failed to fetch work definition details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (companyId && workDefId) {
      fetchWorkDef();
    }
  }, [companyId, workDefId]);

  return { workDef, loading, error };
};

export default useViewWorkDef;