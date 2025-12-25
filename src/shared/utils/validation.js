export const validateForm = (formData) => {
  const errors = {};

  // Name validation
  if (!formData.name || formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long";
  } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
    errors.name = "Name can only contain letters and spaces";
  }

  // Email validation
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  return errors;
};