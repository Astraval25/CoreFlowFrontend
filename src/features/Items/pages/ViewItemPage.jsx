import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ViewItemDetail from "../components/ViewItemDetail";
import { useParams } from "react-router-dom";

const ViewItemPage = () => {
  const { itemId: paramItemId } = useParams();
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
      {paramItemId && companyId ? (
        <ViewItemDetail
          companyId={companyId}
          itemId={Number(paramItemId)}
        />
      ) : (
        <p className="p-6" style={{ color: "var(--text-sub)" }}>Loading item details...</p>
      )}
    </div>
  );
};

export default ViewItemPage;
