import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const useCreateVendorItem = (vendorId) => {
  const [companyId, setCompanyId] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [formData, setFormData] = useState({
    itemId: "",
    purchasePrice: "",
    purchaseDescription: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const compId = decoded?.defaultComp?.[0] || "";
    setCompanyId(compId);

    if (compId) {
      coreApi.getActiveItems(compId).then((res) => {
        setAllItems(res.data.responseData || []);
      });
    }
  }, [vendorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      itemId: Number(formData.itemId),
      purchasePrice: Number(formData.purchasePrice),
      purchaseDescription: formData.purchaseDescription,
    };

    await coreApi.createVendorItem(companyId, vendorId, payload);
    return { success: true };
  };

  return {
    formData,
    allItems,
    handleChange,
    handleSubmit,
  };
};

export default useCreateVendorItem;
