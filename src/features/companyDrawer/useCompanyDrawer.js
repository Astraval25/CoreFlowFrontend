import { useEffect, useState } from "react";
import { coreApi } from "../../shared/services/coreApi";

const useCompanyDrawer = () => {
  const [companies, setCompanies] = useState([]);
  
  useEffect(() => {
    coreApi.getMyCompanies().then((res) => {
      setCompanies(res.data.responseData);
    }).catch((err) => {
      console.error("Failed to fetch companies:", err);
    });
  }, []);
  
  return { companies };
};
export default useCompanyDrawer;
