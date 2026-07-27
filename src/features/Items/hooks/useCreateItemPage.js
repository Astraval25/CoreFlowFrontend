import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

export const useCreateItemPage = (itemId = null) => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemType: "GOODS",
    unit: "PCS",
    baseSalesPrice: "",
    basePurchasePrice: "",
    hsnCode: "",
    taxRate: "",
    salesDescription: "",
    purchaseDescription: "",
    isSellable: true,
    isPurchasable: false
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const decode = jwtDecode(token);
        const companyId = decode.defaultComp[0];

        if (itemId) {
          setIsEditMode(true);
          const itemRes = await coreApi.getItemDetail(companyId, itemId);
          const item = itemRes.data.responseData;

          setFormData({
            itemName: item.itemName || "",
            itemType: item.itemType || "GOODS",
            unit: item.unit || "PCS",
            baseSalesPrice: item.baseSalesPrice || "",
            basePurchasePrice: item.basePurchasePrice || "",
            hsnCode: item.hsnCode || "",
            taxRate: item.taxRate || "",
            salesDescription: item.salesDescription || "",
            purchaseDescription: item.purchaseDescription || "",
            isSellable: item.isSellable ?? Boolean(item.baseSalesPrice),
            isPurchasable: item.isPurchasable ?? Boolean(item.basePurchasePrice)
          });
          
          if (item.itemImage) {
            const imgRes = await coreApi.downloadFile(item.itemImage);
            const blobUrl = URL.createObjectURL(imgRes.data);
            setImageUrl(blobUrl);
          }
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchData();
  }, [itemId]);

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item name is required";
    }

    if (!formData.isSellable && !formData.isPurchasable) {
      newErrors.itemCapability =
        "Select at least one option: sellable or purchasable";
    }

    if (formData.isSellable && !formData.baseSalesPrice) {
      newErrors.baseSalesPrice = "Sales price is required for sellable items";
    }

    if (formData.isPurchasable && !formData.basePurchasePrice) {
      newErrors.basePurchasePrice =
        "Purchase price is required for purchasable items";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  //  create and update 
  const saveItem = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const decode = jwtDecode(token);
      const companyId = decode.defaultComp[0];

      const formDataToSend = new FormData();
      const cleanValue = (value) => (value === "" ? null : value);
      const payload = {
        ...formData,
        itemName: formData.itemName.trim(),
        baseSalesPrice: formData.isSellable
          ? cleanValue(formData.baseSalesPrice)
          : null,
        salesDescription: formData.isSellable
          ? cleanValue(formData.salesDescription.trim())
          : null,
        basePurchasePrice: formData.isPurchasable
          ? cleanValue(formData.basePurchasePrice)
          : null,
        purchaseDescription: formData.isPurchasable
          ? cleanValue(formData.purchaseDescription.trim())
          : null,
        hsnCode: cleanValue(formData.hsnCode.trim()),
        taxRate: cleanValue(formData.taxRate),
      };

      formDataToSend.append("item", JSON.stringify(payload));

      if (file) {
        formDataToSend.append("file", file);
      }

      if (isEditMode) {
        await coreApi.editItem(companyId, itemId, formDataToSend);
      } else {
        await coreApi.createItems(companyId, formDataToSend);
      }

      return { success: true };
    } catch (error) {
      console.error(error);

      return {
        success: false,
        message:
          error.response?.data?.responseMessage ||
          `Failed to ${isEditMode ? "update" : "create"} item`
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    file,
    errors,
    loading,
    isEditMode,
    imageUrl,
    handleInputChange,
    handleFileChange,
    saveItem
  };
};
