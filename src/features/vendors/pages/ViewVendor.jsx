import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ListAllVendor from "./ListAllVendor";
import ViewVendorDetails from "./ViewVendorDetails";
import { useLocation } from "react-router-dom";

const ViewVendor = () => {
  const { state } = useLocation();
  const [selectedVendorId, setSelectedVendorId] = useState(
    state?.vendorId || null
  );
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

  const handleSelectVendor = (id) => {
    setSelectedVendorId(id);
  };

  return (
    <div className="flex gap-4">
      <div className="w-[20%]">
        <ListAllVendor
          selectedVendorId={selectedVendorId}
          onSelectVendor={handleSelectVendor}
        />
      </div>

      <div className="w-[80%]">
        {selectedVendorId && companyId ? (
          <ViewVendorDetails companyId={companyId} vendorId={selectedVendorId} />
        ) : (
          <p className="p-6 text-gray-600">Select a vendor to view details</p>
        )}
      </div>
    </div>
  );
};

export default ViewVendor;
