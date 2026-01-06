export const validateCustomerForm = (formData) => {
  const errors = {};

  /* ================= REQUIRED ================= */

  // Customer Name
  if (!formData.customerName) {
    errors.customerName = "Customer name is required.";
  } else if (/\d/.test(formData.customerName)) {
    errors.customerName = "Customer name cannot contain numbers.";
  }

  // Display Name
  if (!formData.displayName) {
    errors.displayName = "Display name is required.";
  } else if (/\d/.test(formData.displayName)) {
    errors.displayName = "Display name cannot contain numbers.";
  }

  /* ================= EMAIL ================= */

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.email?.trim() && !emailRegex.test(formData.email)) {
    errors.email = "Invalid email address";
  }

  /* ================= PHONE ================= */

  const phoneRegex = /^[0-9]{10}$/;
  if (formData.phone?.trim() && !phoneRegex.test(formData.phone)) {
    errors.phone = "Phone must be 10 digits";
  }

  /* ================= PAN ================= */

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
  if (formData.pan?.trim() && !panRegex.test(formData.pan)) {
    errors.pan = "Invalid PAN (ABCDE1234F)";
  }

  /* ================= GST ================= */

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
  if (formData.gst?.trim() && !gstRegex.test(formData.gst)) {
    errors.gst = "Invalid GST number";
  }

  /* ================= BILLING ================= */

  if (
    formData.billingAddress?.email?.trim() &&
    !emailRegex.test(formData.billingAddress.email)
  ) {
    errors["billingAddress.email"] = "Invalid billing email";
  }

  if (
    formData.billingAddress?.phone?.trim() &&
    !phoneRegex.test(formData.billingAddress.phone)
  ) {
    errors["billingAddress.phone"] = "Invalid billing phone";
  }

  /* ================= SHIPPING ================= */

  if (
    formData.shippingAddress?.email?.trim() &&
    !emailRegex.test(formData.shippingAddress.email)
  ) {
    errors["shippingAddress.email"] = "Invalid shipping email";
  }

  if (
    formData.shippingAddress?.phone?.trim() &&
    !phoneRegex.test(formData.shippingAddress.phone)
  ) {
    errors["shippingAddress.phone"] = "Invalid shipping phone";
  }

  /* ================= PINCODE ================= */

  const pincodeRegex = /^[0-9]{6}$/; // Ensure pincode is exactly 6 digits
  if (formData.billingAddress?.pincode && !pincodeRegex.test(formData.billingAddress.pincode)) {
    errors["billingAddress.pincode"] = "Pincode must be a 6-digit number.";
  }

  if (formData.shippingAddress?.pincode && !pincodeRegex.test(formData.shippingAddress.pincode)) {
    errors["shippingAddress.pincode"] = "Pincode must be a 6-digit number.";
  }

  /* ================= ATTENTION NAME ================= */

  const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces allowed
  if (
    formData.billingAddress?.attentionName?.trim() &&
    !nameRegex.test(formData.billingAddress.attentionName)
  ) {
    errors["billingAddress.attentionName"] = "Attention name cannot contain numbers or special characters.";
  }

  if (
    formData.shippingAddress?.attentionName?.trim() &&
    !nameRegex.test(formData.shippingAddress.attentionName)
  ) {
    errors["shippingAddress.attentionName"] = "Attention name cannot contain numbers or special characters.";
  }

  return errors;
};

export const validateCustomerFormField = (name, value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
  const pincodeRegex = /^[0-9]{6}$/;
  const nameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces allowed

  switch (name) {
    case "customerName":
      if (!value) return "Customer name is required.";
      if (/\d/.test(value)) return "Customer name cannot contain numbers.";
      return "";

    case "displayName":
      if (!value) return "Display name is required.";
      if (/\d/.test(value)) return "Display name cannot contain numbers.";
      return "";

    case "email":
    case "billingAddress.email":
    case "shippingAddress.email":
      if (!value) return "";
      if (!emailRegex.test(value)) return "Invalid email address.";
      return "";

    case "phone":
    case "billingAddress.phone":
    case "shippingAddress.phone":
      if (!value) return "";
      if (!phoneRegex.test(value)) return "Phone must be 10 digits.";
      return "";

    case "pan":
      if (!value) return "";
      if (!panRegex.test(value)) return "Invalid PAN (ABCDE1234F).";
      return "";

    case "gst":
      if (!value) return "";
      if (!gstRegex.test(value)) return "Invalid GST number.";
      return "";

    case "billingAddress.pincode":
    case "shippingAddress.pincode":
      if (!value) return "";
      if (!pincodeRegex.test(value)) return "Pincode must be a 6-digit number.";
      return "";

    case "billingAddress.attentionName":
    case "shippingAddress.attentionName":
      if (!value) return "";
      if (!nameRegex.test(value)) return "Attention name cannot contain numbers or special characters.";
      return "";

    default:
      return "";
  }
};
