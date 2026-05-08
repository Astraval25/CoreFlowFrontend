import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ListAllSales from "../components/ListAllSales";
import ViewSalesDetail from "../components/ViewSalesDetail";
import { useParams } from "react-router-dom";

const ViewSalesPage = () => {
  const { salesId: paramOrderId } = useParams();
  const [selectedOrderId, setSelectedOrderId] = useState(
    paramOrderId ? Number(paramOrderId) : null
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

  useEffect(() => {
    if (paramOrderId) setSelectedOrderId(Number(paramOrderId));
  }, [paramOrderId]);

  const handleSelectOrder = (id) => {
    setSelectedOrderId(id);
  };

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-white shadow-sm">
      <div className="flex">
        <div className="w-[22%]">
        <ListAllSales
          selectedOrderId={selectedOrderId}
          onSelectOrder={handleSelectOrder}
        />
        </div>

        <div className="w-[78%] p-2">
          {selectedOrderId && companyId ? (
            <ViewSalesDetail companyId={companyId} orderId={selectedOrderId} />
          ) : (
            <p className="p-6 text-gray-600">Select an order to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewSalesPage;
