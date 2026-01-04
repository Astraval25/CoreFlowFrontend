import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { validateCustomerForm } from "../../../shared/utils/customerValidation";
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
  customerName: "",
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

const useCreateCustomer = (customerId = null) => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(false);

  const isEditMode = Boolean(customerId);

  // Get companyId and load customer if edit
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const compId = decoded?.defaultComp?.[0] || "";
    setCompanyId(compId);

    if (customerId && compId) {
      loadCustomerData(compId, customerId);
    }
  }, [customerId]);

  const loadCustomerData = async (compId, custId) => {
    try {
      const res = await coreApi.getCustomerDetail(compId, custId);
      const data = res.data.responseData;

      if (!data) return;

      setFormData({
        customerName: data.customerName || "",
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
      console.error("Failed to load customer:", err);
    }
  };

  //  Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => {
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
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
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
  const submitCustomer = async () => {
    const validationErrors = validateCustomerForm(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = removeEmptyFields({
      customerName: formData.customerName,
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

    setLoading(true);
    try {
      const res = isEditMode
        ? await coreApi.editCustomer(companyId, customerId, payload)
        : await coreApi.createCustomer(companyId, payload);

      if (!isEditMode) {
        setFormData(initialForm);
        setSameAsBilling(false);
      }

      setErrors({});
      return res.data;
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
    submitCustomer,
  };
};

export default useCreateCustomer;
