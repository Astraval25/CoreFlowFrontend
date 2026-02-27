import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";
import useItemsPage from "../../Items/hooks/useItemsPage";
import { useCustomer } from "../../customer/hooks/useCustomer";
import { useVendor } from "../../vendors/hooks/useVendor";

const useCreatePurchase = (orderId = null) => {
  const { items } = useItemsPage();
  const { allCustomers } = useCustomer();
  const { allVendors } = useVendor();
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    vendorId: "",
    taxAmount: "",
    discountAmount: "",
    deliveryCharge: "",
    hasBill: true,
    orderItems: [],
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) return;

      setIsEditMode(true);
      try {
        const token = localStorage.getItem("token");
        const decode = jwtDecode(token);
        const companyId = decode?.defaultComp?.[0];

        const response = await coreApi.getPurchaseDetail(companyId, orderId);
        const order = response.data.responseData;

        setFormData({
          vendorId: order.vendorId || "",
          taxAmount: order.taxAmount || "",
          discountAmount: order.discountAmount || "",
          deliveryCharge: order.deliveryCharge || "",
          hasBill: order.hasBill ?? true,
          orderItems: order.orderItems?.map(item => ({
            itemId: item.itemId || "",
            itemName: item.itemName || "",
            itemDescription: item.itemDescription || "",
            quantity: item.quantity || "1",
            updatedPrice: item.updatedPrice || "1",
          })) || [],
        });
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);  

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

      if (isEditMode) {
        await coreApi.editPurchase(companyId, orderId, payload);
      } else {
        await coreApi.createPurchase(companyId, payload);
      }
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.responseMessage || `Failed to ${isEditMode ? "update" : "create"} purchase`
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
    isEditMode,
    handleInputChange,
    addOrderItem,
    updateOrderItem,
    removeOrderItem,
    submitPurchase,
  };
};

export default useCreatePurchase;
