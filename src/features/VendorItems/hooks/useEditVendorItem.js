import { useState } from "react";
import { coreApi } from "../../../shared/services/coreApi";

const useEditVendorItem = (companyId, vendorId, item) => {
  const [formData, setFormData] = useState({
    purchasePrice: item?.purchasePrice || "",
    purchaseDescription: item?.purchaseDescription || "",
  });

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
