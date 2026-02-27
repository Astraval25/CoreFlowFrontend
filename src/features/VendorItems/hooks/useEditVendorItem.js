import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const useEditVendorItem = (vendorId, item) => {
  const [companyId, setCompanyId] = useState("");
  const [formData, setFormData] = useState({
    purchasePrice: item?.purchasePrice || "",
    purchaseDescription: item?.purchaseDescription || "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const compId = decoded?.defaultComp?.[0] || "";
    setCompanyId(compId);
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({
        purchasePrice: item.purchasePrice || "",
        purchaseDescription: item.purchaseDescription || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      purchasePrice: Number(formData.purchasePrice),
      purchaseDescription: formData.purchaseDescription,
    };

    await coreApi.editVendorItem(companyId, vendorId, item.itemId, payload);
    return { success: true };
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};

export default useEditVendorItem;
