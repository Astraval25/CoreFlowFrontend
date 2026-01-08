import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ListAllCustomer from "./ListAllCustomer";
import ViewCustomerDetail from "./ViewCustomerDetail";
import { useSearchParams } from "react-router-dom";

const ViewCustomer = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");

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
    setSearchParams({ customerId: id });
  };

  return (
    <div className="flex gap-4">
      <div className="w-[20%]">
        <ListAllCustomer
          selectedCustomerId={customerId}
          onSelectCustomer={handleSelectCustomer}
        />
      </div>

      <div className="w-[80%]">
        {customerId && companyId ? (
          <ViewCustomerDetail companyId={companyId} customerId={customerId} />
        ) : (
          <p className="p-6 text-gray-600">Select a customer to view details</p>
        )}
      </div>
    </div>
  );
};

export default ViewCustomer;
