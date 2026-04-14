import { useEffect, useState } from "react";
import { coreApi } from "../../../shared/services/coreApi";

export const useEmployeeProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    coreApi
      .getMyProfile()
      .then((res) => {
        setProfile(res.data.responseData || null);
      })
      .catch((err) => console.error("Profile fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading };
};
