import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ViewCustomerDetail from "./ViewCustomerDetail";
import { useLocation, useParams } from "react-router-dom";

const ViewCustomer = () => {
  const { customerId: paramCustomerId } = useParams();
  const { state } = useLocation();
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
      {paramCustomerId && companyId ? (
        <ViewCustomerDetail
          companyId={companyId}
          customerId={Number(paramCustomerId)}
          notice={state?.notice}
        />
      ) : (
        <p className="p-6 text-app-sub">Loading customer details...</p>
      )}
    </div>
  );
};

export default ViewCustomer;
