import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { validateVendorForm } from "../../../shared/utils/vendorValidation";
import { coreApi } from "../../../shared/services/coreApi";

const initialAddress = {
  attentionName: "",
  country: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
};

const initialForm = {
  vendorName: "",
  displayName: "",
  email: "",
  phone: "",
  lang: "",
  pan: "",
  gst: "",
  advanceAmount: "",
  billingAddress: { ...initialAddress },
  shippingAddress: { ...initialAddress },
};

const removeEmptyFields = (obj) => {
  if (!obj || typeof obj !== "object") return obj;

  const filtered = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      const nested = removeEmptyFields(value);
      if (Object.keys(nested).length) filtered[key] = nested;
    } else if (value !== "" && value !== undefined && value !== null) {
      filtered[key] = value;
    }
  });
  return filtered;
};

const useCreateVendor = (vendorId = null) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(vendorId);

  // Get companyId and load vendor if edit
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const compId = decoded?.defaultComp?.[0] || "";
    setCompanyId(compId);

    if (vendorId && compId) {
      loadVendorData(compId, vendorId);
    }
  }, [vendorId]);

  const loadVendorData = async (compId, vendorId) => {
    try {
      const res = await coreApi.getVendorDetail(compId, vendorId);
      const data = res.data.responseData;

      if (!data) return;

      setFormData({
        vendorName: data.vendorName || "",
        displayName: data.displayName || "",
        email: data.email || "",
        phone: data.phone || "",
        lang: data.lang || "",
        pan: data.pan || "",
        gst: data.gst || "",
        advanceAmount: data.advanceAmount || "",
        billingAddress: { ...initialAddress, ...data.billingAddrId },
        shippingAddress: data.sameAsBillingAddress
          ? { ...initialAddress, ...data.billingAddrId }
          : { ...initialAddress, ...data.shippingAddrId },
      });

      setSameAsBilling(Boolean(data.sameAsBillingAddress));
    } catch (err) {
      console.error("Failed to load vendor:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (sameAsBilling && name.startsWith("shippingAddress.")) {
        setSameAsBilling(false);
      }
      if (name.includes(".")) {
        const [section, field] = name.split(".");
        const updated = {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: value,
          },
        };

        if (sameAsBilling && section === "billingAddress") {
          updated.shippingAddress = { ...updated.billingAddress };
        }

        return updated;
      }
      return { ...prev, [name]: value };  
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Same as billing toggle
  const handleSameAsBilling = (checked) => {
    setSameAsBilling(checked);
    setFormData((prev) => ({
      ...prev,
      shippingAddress: checked
        ? { ...prev.billingAddress }
        : { ...initialAddress },
    }));
  };
  
  // create or update
  const submitVendor = async () => {
    console.log("submitVendor called");
    
    if (!companyId) {
      console.error("Company ID not available");
      return;
    }

    // Validate the entire form
    const validationErrors = validateVendorForm(formData);

    // If there are validation errors, set them in the state and stop submission
    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation errors:", validationErrors);
      setErrors(validationErrors);
      return;
    }

    const payload = removeEmptyFields({
      vendorName: formData.vendorName,
      displayName: formData.displayName,
      email: formData.email,
      phone: formData.phone,
      lang: formData.lang,
      pan: formData.pan,
      gst: formData.gst,
      advanceAmount: Number(formData.advanceAmount) || 0,
      sameAsBillingAddress: sameAsBilling,
      billingAddress: formData.billingAddress,
      ...(sameAsBilling ? {} : { shippingAddress: formData.shippingAddress }),
    });

    console.log("Payload:", payload);

    setLoading(true);
    try {
      const res = isEditMode
        ? await coreApi.editVendor(companyId, vendorId, payload)
        : await coreApi.createVendor(companyId, payload);

      console.log("API response:", res);

      if (!isEditMode) {
        setFormData(initialForm);
        setSameAsBilling(false);
      }

      setErrors({}); // Clear errors on successful submission
      return res.data;
    } catch (error) {
      console.error("Vendor submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    sameAsBilling,
    handleChange,
    handleSameAsBilling,
    submitVendor,
  };
};

export default useCreateVendor;
