import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const useEditCustomerItem = (customerId, item) => {
  const [companyId, setCompanyId] = useState("");
  const [formData, setFormData] = useState({
    salesPrice: item?.salesPrice || "",
    salesDescription: item?.salesDescription || "",
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
        salesPrice: item.salesPrice || "",
        salesDescription: item.salesDescription || "",
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      salesPrice: Number(formData.salesPrice),
      salesDescription: formData.salesDescription,
    };

    await coreApi.editCustomerItem(companyId, customerId, item.itemId, payload);
    return { success: true };
  };

  return {
    formData,
    handleChange,
    handleSubmit,
  };
};

export default useEditCustomerItem;
