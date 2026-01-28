import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

export const useCreateItemPage = (itemId = null) => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemType: "GOODS",
    unit: "PCS",
    salesDescription: "",
    salesPrice: "",
    preferredCustomerId: "",
    purchaseDescription: "",
    purchasePrice: "",
    preferredVendorId: "",
    hsnCode: "",
    taxRate: ""
  });

  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
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

        const [customersRes, vendorsRes] = await Promise.all([
          coreApi.getAllCustomerByCompanyId(companyId),
          coreApi.getAllVendorByCompanyId(companyId)
        ]);

        setCustomers(customersRes.data.responseData || []);
        setVendors(vendorsRes.data.responseData || []);

        // fetch item details
        if (itemId) {
          setIsEditMode(true);

          const itemRes = await coreApi.getItemDetail(companyId, itemId);
          const item = itemRes.data.responseData;

          setFormData({
            itemName: item.itemName || "",
            itemType: item.itemType || "GOODS",
            unit: item.unit || "PCS",
            salesDescription: item.salesDescription || "",
            salesPrice: item.salesPrice || "",
            preferredCustomerId: item.preferredCustomerId || "",
            purchaseDescription: item.purchaseDescription || "",
            purchasePrice: item.purchasePrice || "",
            preferredVendorId: item.preferredVendorId || "",
            hsnCode: item.hsnCode || "",
            taxRate: item.taxRate || "",
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

    if (!formData.salesPrice && !formData.purchasePrice) {
      newErrors.salesPrice = "Either sales or purchase price required";
      newErrors.purchasePrice = "Either sales or purchase price required";
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

      // ONLY DTO fields
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
    customers,
    vendors,
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
