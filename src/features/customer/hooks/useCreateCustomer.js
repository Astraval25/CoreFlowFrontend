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
    if (typeof value === "object") {
      const nested = removeEmptyFields(value);
      if (Object.keys(nested).length) filtered[key] = nested;
    } else if (value !== "") {
      filtered[key] = value;
    }
  });
  return filtered;
};

const useCreateCustomer = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sameAsBilling, setSameAsBilling] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(false);

  // Get companyId from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setCompanyId(decoded?.defaultComp?.[0] || "");
    }
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setFormData((prev) => {
        const updated = {
          ...prev,
          [section]: { ...prev[section], [field]: value },
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

  // Same as billing
  const handleSameAsBilling = (checked) => {
    setSameAsBilling(checked);
    setFormData((prev) => ({
      ...prev,
      shippingAddress: checked
        ? { ...prev.billingAddress }
        : { ...initialAddress },
    }));
  };

  // Submit
  const submitCustomer = async () => {
    const validationErrors = validateCustomerForm(formData);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const payload = removeEmptyFields({
      ...formData,
      advanceAmount: Number(formData.advanceAmount) || 0,
      sameAsBillingAddress: sameAsBilling,
    });

    setLoading(true);
    try {
      const res = await coreApi.createCustomer(companyId, payload);
      setErrors({});
      // Clear form after successful creation
      setFormData(initialForm);
      setSameAsBilling(false);
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
