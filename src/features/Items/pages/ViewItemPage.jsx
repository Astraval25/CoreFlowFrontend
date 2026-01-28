import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ListAllItems from "../components/ListAllItems";
import ViewItemDetail from "../components/ViewItemDetail";
import { useLocation } from "react-router-dom";

const ViewItemPage = () => {
  const { state } = useLocation();
  const [selectedItemId, setSelectedItemId] = useState(
    state?.itemId || null
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

  const handleSelectItem = (id) => {
    setSelectedItemId(id);
  };

  return (
    <div className="flex gap-4">
      <div className="w-[20%]">
        <ListAllItems
          selectedItemId={selectedItemId}
          onSelectItem={handleSelectItem}
        />
      </div>

      <div className="w-[80%]">
        {selectedItemId && companyId ? (
          <ViewItemDetail
            companyId={companyId}
            itemId={selectedItemId}
          />
        ) : (
          <p className="p-6 text-gray-600">Select an item to view details</p>
        )}
      </div>
    </div>
  );
};

export default ViewItemPage;