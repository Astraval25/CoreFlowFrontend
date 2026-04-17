import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ViewVendorDetails from "./ViewVendorDetails";
import { useParams } from "react-router-dom";

const ViewVendor = () => {
  const { vendorId: paramVendorId } = useParams();
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setCompanyId(decoded?.defaultComp?.[0]);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }, []);

  return (
    <div className="w-full">
      {paramVendorId && companyId ? (
        <ViewVendorDetails companyId={companyId} vendorId={Number(paramVendorId)} />
      ) : (
        <p className="p-6" style={{ color: "var(--text-sub)" }}>Loading vendor details...</p>
      )}
    </div>
  );
};

export default ViewVendor;
