export const validateCustomerForm = (formData) => {
  const errors = {};

  // Customer Name - mandatory
  if (!formData.customerName || formData.customerName.trim().length === 0) {
    errors.customerName = "Customer Name is required";
  }

  // Display Name - mandatory
  if (!formData.displayName || formData.displayName.trim().length === 0) {
    errors.displayName = "Display Name is required";
  }

  // Email validation (optional but must be valid if provided)
  if (formData.email && formData.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
  }

  // Contact validation (optional but must be valid if provided)
  if (formData.contact && formData.contact.trim().length > 0) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.contact.replace(/\s+/g, ''))) {
      errors.contact = "Please enter a valid 10-digit mobile number";
    }
  }

  // Billing Address validations
  if (formData.billingAddress?.email && formData.billingAddress.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.billingAddress.email)) {
      errors['billingAddress.email'] = "Please enter a valid email address";
    }
  }

  if (formData.billingAddress?.phone && formData.billingAddress.phone.trim().length > 0) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.billingAddress.phone.replace(/\s+/g, ''))) {
      errors['billingAddress.phone'] = "Please enter a valid 10-digit phone number";
    }
  }

  // Shipping Address validations
  if (formData.shippingAddress?.email && formData.shippingAddress.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.shippingAddress.email)) {
      errors['shippingAddress.email'] = "Please enter a valid email address";
    }
  }

  if (formData.shippingAddress?.phone && formData.shippingAddress.phone.trim().length > 0) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.shippingAddress.phone.replace(/\s+/g, ''))) {
      errors['shippingAddress.phone'] = "Please enter a valid 10-digit phone number";
    }
  }

  return errors;
};