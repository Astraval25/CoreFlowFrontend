const requiredFields = ["vendorName", "displayName"];

export const validateVendorForm = (formData) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!formData[field]?.trim()) {
      errors[field] =
        field === "vendorName"
          ? "Vendor name is required."
          : "Display name is required.";
    }
  });

  return errors;
};