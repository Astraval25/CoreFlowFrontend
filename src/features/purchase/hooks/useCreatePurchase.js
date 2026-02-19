import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";
import useItemsPage from "../../Items/hooks/useItemsPage";
import { useCustomer } from "../../customer/hooks/useCustomer";
import { useVendor } from "../../vendors/hooks/useVendor";

const useCreatePurchase = () => {
  const { items } = useItemsPage();
  const { allCustomers } = useCustomer();
  const { allVendors } = useVendor();

  const [formData, setFormData] = useState({
    vendorId: "",
    customerId: "",
    taxAmount: "",
    discountAmount: "",
    deliveryCharge: "",
    hasBill: true,
    orderItems: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const addOrderItem = () => {
    setFormData((prev) => ({
      ...prev,
      orderItems: [
        ...prev.orderItems,
        {
          itemId: "",
          itemName: "",
          itemDescription: "",
          quantity: "1",
          updatedPrice: "1",
        },
      ],
    }));
  };

  const updateOrderItem = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.orderItems];

      if (field === "itemName") {
        const selectedItem = items.find(item => item.itemName === value);
        updated[index] = {
          ...updated[index],
          itemId: selectedItem ? selectedItem.itemId : "",
          itemName: value,
          updatedPrice: selectedItem ? selectedItem.salesPrice || "1" : "1",
        };
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
      }

      return { ...prev, orderItems: updated };
    });
  };

  const removeOrderItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      orderItems: prev.orderItems.filter((_, i) => i !== index),
    }));
  };

  const submitPurchase = async () => {
    setLoading(true);
    let newErrors = {};

    if (!formData.vendorId) {
        newErrors.vendorId = "Vendor is required";
      }
    
      if (!formData.customerId) {
        newErrors.customerId = "Customer is required";
      }
    
      if (!formData.orderItems.length) {
        newErrors.orderItems = "Add at least one item";
      }
    
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return { success: false };
      }
    
      setErrors({});

    try {
      const token = localStorage.getItem("token");
      const decode = jwtDecode(token);
      const companyId = decode?.defaultComp?.[0];

      const payload = {
        vendorId: Number(formData.vendorId),
        customerId: Number(formData.customerId),
        taxAmount: Number(formData.taxAmount || 0),
        discountAmount: Number(formData.discountAmount || 0),
        deliveryCharge: Number(formData.deliveryCharge || 0),
        hasBill: formData.hasBill,
        orderItems: formData.orderItems.map((item) => ({
          itemId: Number(item.itemId),
          itemDescription: item.itemDescription,
          quantity: Number(item.quantity),
          updatedPrice: Number(item.updatedPrice),
        })),
      };

      await coreApi.createPurchase(companyId, payload);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.responseMessage || "Failed to create purchase"
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    items,
    allCustomers,
    allVendors,
    loading,
    errors,
    handleInputChange,
    addOrderItem,
    updateOrderItem,
    removeOrderItem,
    submitPurchase,
  };
};

export default useCreatePurchase;
