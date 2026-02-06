import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ViewPurchaseDetail from "../components/ViewPurchaseDetail";
import ListAllPurchase from "../components/ListAllPurchase";
import { useLocation } from "react-router-dom";

const ViewPurchasePage = () => {
  const { state } = useLocation();
  const [selectedOrderId, setSelectedOrderId] = useState(
    state?.orderId || null
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

  const handleSelectOrder = (id) => {
    setSelectedOrderId(id);
  };

  return (
    <div className="flex gap-4">
      <div className="w-[20%]">
        <ListAllPurchase
          selectedOrderId={selectedOrderId}
          onSelectOrder={handleSelectOrder}
        />
      </div>

      <div className="w-[80%]">
        {selectedOrderId && companyId ? (
          <ViewPurchaseDetail
            companyId={companyId}
            orderId={selectedOrderId}
          />
        ) : (
          <p className="p-6 text-gray-600">Select a purchase order to view details</p>
        )}
      </div>
    </div>
  );
};

export default ViewPurchasePage;
