import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

export const useCreateItemPage = (itemId = null) => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemType: "GOODS",
    unit: "PCS",
    isSellable: true,
    isPurchasable: false,
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
            isSellable: item.isSellable ?? Boolean(item.baseSalesPrice),
            isPurchasable: item.isPurchasable ?? Boolean(item.basePurchasePrice),
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
    const { name, type, checked, value } = e.target;
    const nextValue = type === "checkbox" ? checked : value;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: nextValue
      };

      if (type === "checkbox" && name === "isSellable" && !checked) {
        next.baseSalesPrice = "";
        next.salesDescription = "";
      }

      if (type === "checkbox" && name === "isPurchasable" && !checked) {
        next.basePurchasePrice = "";
        next.purchaseDescription = "";
      }

      return next;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (errors.itemAvailability) {
      setErrors((prev) => ({ ...prev, itemAvailability: "" }));
    }

    if (type === "checkbox" && name === "isSellable" && !checked && errors.baseSalesPrice) {
      setErrors((prev) => ({ ...prev, baseSalesPrice: "" }));
    }

    if (type === "checkbox" && name === "isPurchasable" && !checked && errors.basePurchasePrice) {
      setErrors((prev) => ({ ...prev, basePurchasePrice: "" }));
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = "Item name is required";
    }

    if (!formData.isSellable && !formData.isPurchasable) {
      newErrors.itemAvailability = "Select at least one option: Sellable or Purchasable";
    }

    if (formData.isSellable && !formData.baseSalesPrice) {
      newErrors.baseSalesPrice = "Sales price is required for sellable items";
    }

    if (formData.isPurchasable && !formData.basePurchasePrice) {
      newErrors.basePurchasePrice = "Purchase price is required for purchasable items";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveItem = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const decode = jwtDecode(token);
      const companyId = decode.defaultComp[0];

      const toNullableText = (value) => {
        if (value === null || value === undefined) return null;
        const text = String(value).trim();
        return text === "" ? null : text;
      };

      const toNullableNumber = (value) => {
        if (value === null || value === undefined || value === "") return null;
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : null;
      };

      const payload = {
        ...formData,
        itemName: toNullableText(formData.itemName),
        itemType: toNullableText(formData.itemType),
        unit: toNullableText(formData.unit),
        isSellable: Boolean(formData.isSellable),
        isPurchasable: Boolean(formData.isPurchasable),
        salesDescription: formData.isSellable ? toNullableText(formData.salesDescription) : null,
        baseSalesPrice: formData.isSellable ? toNullableNumber(formData.baseSalesPrice) : null,
        purchaseDescription: formData.isPurchasable ? toNullableText(formData.purchaseDescription) : null,
        basePurchasePrice: formData.isPurchasable ? toNullableNumber(formData.basePurchasePrice) : null,
        hsnCode: toNullableText(formData.hsnCode),
        taxRate: toNullableNumber(formData.taxRate)
      };

      const formDataToSend = new FormData();
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
