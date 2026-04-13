import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ListAllCustomer from "./ListAllCustomer";
import ViewCustomerDetail from "./ViewCustomerDetail";
import { useParams } from "react-router-dom";

const ViewCustomer = () => {
  const { customerId: paramCustomerId } = useParams();
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    paramCustomerId ? Number(paramCustomerId) : null
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

  const handleSelectCustomer = (id) => {
    setSelectedCustomerId(id);
  };

  return (
    <div className="w-full">
      <div className="flex gap-3">
        <div className="w-[22%]">
        <ListAllCustomer
          selectedCustomerId={selectedCustomerId}
          onSelectCustomer={handleSelectCustomer}
        />
        </div>

        <div className="w-[78%]">
          {selectedCustomerId && companyId ? (
            <ViewCustomerDetail
              companyId={companyId}
              customerId={selectedCustomerId}
            />
          ) : (
            <p className="p-6 text-gray-600">Select a customer to view details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewCustomer;
