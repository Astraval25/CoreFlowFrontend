import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const useCreateCustomerItem = (customerId) => {
  const [companyId, setCompanyId] = useState("");
  const [allItems, setAllItems] = useState([]);
  const [formData, setFormData] = useState({
    itemId: "",
    salesPrice: "",
    salesDescription: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const compId = decoded?.defaultComp?.[0] || "";
    setCompanyId(compId);

    if (compId) {
      coreApi.getCustomerItems(compId, customerId).then((res) => {
        setAllItems(res.data.responseData || []);
      });
    }
  }, [customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = {
      itemId: Number(formData.itemId),
      salesPrice: Number(formData.salesPrice),
      salesDescription: formData.salesDescription,
    };

    await coreApi.createcustomerItem(companyId, customerId, payload);
    return { success: true };
  };

  return {
    formData,
    allItems,
    handleChange,
    handleSubmit,
  };
};

export default useCreateCustomerItem;
