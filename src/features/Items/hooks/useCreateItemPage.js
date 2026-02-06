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
    purchaseDescription: ""
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
            purchaseDescription: item.purchaseDescription || ""
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
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
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

    if (!formData.baseSalesPrice && !formData.basePurchasePrice) {
      newErrors.baseSalesPrice = "Either sales or purchase price required";
      newErrors.basePurchasePrice = "Either sales or purchase price required";
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

      formDataToSend.append("item", JSON.stringify(formData));

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
