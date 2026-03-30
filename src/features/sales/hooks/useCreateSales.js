import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";
import useItemsPage from "../../Items/hooks/useItemsPage";
import { useCustomer } from "../../customer/hooks/useCustomer";

const useCreateSales = () => {
  const { items } = useItemsPage();
  const { allCustomers } = useCustomer();

  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    customerId: "",
    orderDate: today,
    taxAmount: "",
    discountAmount: "",
    discountType: "percent",   // "percent" | "flat"
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
    setErrors((prev) => ({ ...prev, [name]: "" }));
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
          updatedPrice: selectedItem ? selectedItem.baseSalesPrice || "1" : "1",
        };
        setErrors((prev) => ({ ...prev, [`item_${index}_itemId`]: "" }));
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
        if (field === "quantity") {
          setErrors((prev) => ({ ...prev, [`item_${index}_quantity`]: "" }));
        } else if (field === "updatedPrice") {
          setErrors((prev) => ({ ...prev, [`item_${index}_price`]: "" }));
        }
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

  const submitSales = async () => {
    setLoading(true);
    const newErrors = {};

    if (!formData.customerId) newErrors.customerId = "Customer is required";
    if (!formData.deliveryCharge) newErrors.deliveryCharge = "Delivery charge is required";
    if (!formData.orderItems.length) {
      newErrors.orderItems = "Add at least one item";
    } else {
      formData.orderItems.forEach((item, index) => {
        if (!item.itemId) {
          newErrors[`item_${index}_itemId`] = "Item is required";
        }
        if (!item.quantity || item.quantity <= 0) {
          newErrors[`item_${index}_quantity`] = "Quantity is required";
        }
        if (!item.updatedPrice || item.updatedPrice <= 0) {
          newErrors[`item_${index}_price`] = "Price is required";
        }
      });
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

      const subTotal = formData.orderItems.reduce(
        (s, i) => s + Number(i.quantity || 0) * Number(i.updatedPrice || 0),
        0
      );
      const discountAmount =
        formData.discountType === "percent"
          ? subTotal * (Number(formData.discountAmount || 0) / 100)
          : Number(formData.discountAmount || 0);

      const payload = {
        customerId: Number(formData.customerId),
        orderDate: formData.orderDate,
        taxAmount: Number(formData.taxAmount || 0),
        discountAmount,
        deliveryCharge: Number(formData.deliveryCharge || 0),
        hasBill: formData.hasBill,
        orderItems: formData.orderItems.map((item) => ({
          itemId: Number(item.itemId),
          itemDescription: item.itemDescription,
          quantity: Number(item.quantity),
          updatedPrice: Number(item.updatedPrice),
        })),
      };

      await coreApi.createSales(companyId, payload);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.responseMessage || "Failed to create sales order"
      };
    } finally {
      setLoading(false);
    }
  };

  const subTotal = formData.orderItems.reduce(
    (s, i) => s + Number(i.quantity || 0) * Number(i.updatedPrice || 0),
    0
  );
  const discountVal =
    formData.discountType === "percent"
      ? subTotal * (Number(formData.discountAmount || 0) / 100)
      : Number(formData.discountAmount || 0);
  const taxVal = Number(formData.taxAmount || 0);
  const adjustmentVal = Number(formData.deliveryCharge || 0);
  const grandTotal = subTotal - discountVal + taxVal + adjustmentVal;

  return {
    formData,
    items,
    allCustomers,
    loading,
    errors,
    subTotal,
    discountVal,
    taxVal,
    adjustmentVal,
    grandTotal,
    handleInputChange,
    addOrderItem,
    updateOrderItem,
    removeOrderItem,
    submitSales,
  };
};

export default useCreateSales;
