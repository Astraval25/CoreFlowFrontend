const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
const pincodeRegex = /^[0-9]{6}$/;
const nameRegex = /^[a-zA-Z\s]+$/;

const requiredFields = ["customerName", "displayName"];

/* ================= FIELD ================= */

export const validateCustomerField = (name, value) => {
  const trimmed = typeof value === "string" ? value.trim() : value ?? "";

  if (requiredFields.includes(name)) {
    if (!trimmed) {
      return name === "customerName"
        ? "Customer name is required."
        : "Display name is required.";
    }
    if (/\d/.test(trimmed)) return "Name cannot contain numbers.";
    return "";
  }

  if (!trimmed) return "";

  switch (name) {
    case "email":
    case "billingAddress.email":
    case "shippingAddress.email":
      return emailRegex.test(trimmed) ? "" : "Invalid email address.";

    case "phone":
    case "billingAddress.phone":
    case "shippingAddress.phone":
      return phoneRegex.test(String(trimmed)) ? "" : "Phone must be 10 digits.";

    case "pan":
      return panRegex.test(trimmed) ? "" : "Invalid PAN (ABCDE1234F).";

    case "gst":
      return gstRegex.test(trimmed) ? "" : "Invalid GST number.";

    case "billingAddress.pincode":
    case "shippingAddress.pincode":
      return pincodeRegex.test(String(trimmed))
        ? ""
        : "Pincode must be a 6-digit number.";

    case "billingAddress.attentionName":
    case "shippingAddress.attentionName":
      return nameRegex.test(trimmed)
        ? ""
        : "Attention name cannot contain numbers or special characters.";

    default:
      return "";
  }
};

/* ================= FORM ================= */

export const validateCustomerForm = (formData) => {
  const errors = {};

  requiredFields.forEach((field) => {
    const error = validateCustomerField(field, formData[field]);
    if (error) errors[field] = error;
  });

  ["email", "phone", "pan", "gst"].forEach((field) => {
    const error = validateCustomerField(field, formData[field]);
    if (error) errors[field] = error;
  });

  Object.entries(formData.billingAddress || {}).forEach(([key, value]) => {
    const error = validateCustomerField(`billingAddress.${key}`, value);
    if (error) errors[`billingAddress.${key}`] = error;
  });

  Object.entries(formData.shippingAddress || {}).forEach(([key, value]) => {
    const error = validateCustomerField(`shippingAddress.${key}`, value);
    if (error) errors[`shippingAddress.${key}`] = error;
  });

  return errors;
};
