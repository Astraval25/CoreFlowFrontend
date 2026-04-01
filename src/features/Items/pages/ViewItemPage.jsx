import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ListAllItems from "../components/ListAllItems";
import ViewItemDetail from "../components/ViewItemDetail";
import { useParams } from "react-router-dom";

const ViewItemPage = () => {
  const { itemId: paramItemId } = useParams();
  const [selectedItemId, setSelectedItemId] = useState(
    paramItemId ? Number(paramItemId) : null
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
    <div className="rounded-2xl border border-[#d9e1d9] bg-white shadow-sm">
      <div className="flex">
        <div className="w-[22%]">
        <ListAllItems
          selectedItemId={selectedItemId}
          onSelectItem={handleSelectItem}
        />
        </div>

        <div className="w-[78%] p-2">
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
    </div>
  );
};

export default ViewItemPage;
