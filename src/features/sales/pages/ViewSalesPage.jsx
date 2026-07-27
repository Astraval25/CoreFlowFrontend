import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ListAllSales from "../components/ListAllSales";
import ViewSalesDetail from "../components/ViewSalesDetail";
import { useParams } from "react-router-dom";
import { MdPointOfSale } from "react-icons/md";

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
    <div className="w-full">
      <section className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-extrabold text-app-text">Sales Orders</h1>
            <p className="text-xs mt-0.5 text-app-sub">Browse and inspect sales order details</p>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="min-w-0">
        <ListAllSales
          selectedOrderId={selectedOrderId}
          onSelectOrder={handleSelectOrder}
        />
          </div>

          <div className="min-w-0 rounded-2xl border border-line bg-white shadow-sm">
            {selectedOrderId && companyId ? (
              <ViewSalesDetail companyId={companyId} orderId={selectedOrderId} />
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-surface-soft">
                  <MdPointOfSale size={24} className="text-info" />
                </div>
                <p className="text-base font-extrabold text-app-text">Select a sales order</p>
                <p className="mt-1 text-sm text-app-sub">
                  Choose an order from the left panel to view full details.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewSalesPage;
