const requiredFields = ["customerName", "displayName"];

export const validateCustomerForm = (formData) => {
  const errors = {};

  requiredFields.forEach((field) => {
    if (!formData[field]?.trim()) {
      errors[field] =
        field === "customerName"
          ? "Customer name is required."
          : "Display name is required.";
    }
  });

  return errors;
};
