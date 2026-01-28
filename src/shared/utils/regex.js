export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^[0-9]{10}$/;
export const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
export const gstRegex =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
export const pincodeRegex = /^[0-9]{6}$/;
export const nameRegex = /^[a-zA-Z\s]+$/;
export const itemNameRegex = /^[a-zA-Z0-9_\s]+$/;
export const priceRegex = /^\d+(\.\d{1,2})?$/;
export const hsnRegex = /^(\d{4}|\d{6}|\d{8})$/;
