import { useState } from "react";
import { validateCustomerForm } from "../../../shared/utils/customerValidation.js";

const CreateCustomerPage = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    displayName: "",
    email: "",
    contact: "",
    language: "",
    pan: "",
    gst: "",
    advanceAmount: "",
    billingAddress: {
      country: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: ""
    },
    shippingAddress: {
      country: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      email: ""
    }
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateCustomerForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    // Form is valid, proceed with submission
    console.log("Form submitted:", formData);
  };

  return (
    <div className="p-6">
      <h1 className="font-semibold text-lg mb-6">New Customer</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-[180px_1fr] gap-x-6 gap-y-4 items-center max-w-3xl">
        {/* Customer Name */}
        <label
          htmlFor="customerName"
          className="text-sm font-medium text-gray-700"
        >
          Customer Name *
        </label>
        <div>
          <input
            id="customerName"
            name="customerName"
            type="text"
            value={formData.customerName}
            onChange={handleChange}
            placeholder="Enter Customer Name"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.customerName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.customerName && (
            <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
          )}
        </div>

        {/* Display Name */}
        <label
          htmlFor="displayName"
          className="text-sm font-medium text-gray-700"
        >
          Display Name *
        </label>
        <div>
          <input
            id="displayName"
            name="displayName"
            type="text"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="Enter Display Name"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.displayName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.displayName && (
            <p className="text-red-500 text-xs mt-1">{errors.displayName}</p>
          )}
        </div>

        {/* Email */}
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </label>
        <div>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter Email"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Contact Number */}
        <label htmlFor="contact" className="text-sm font-medium text-gray-700">
          Contact Number
        </label>
        <div>
          <input
            id="contact"
            name="contact"
            type="text"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Enter Contact Number"
            className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contact ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contact && (
            <p className="text-red-500 text-xs mt-1">{errors.contact}</p>
          )}
        </div>

        <label htmlFor="language" className="text-sm font-medium text-gray-700">
          Language
        </label>
        <input
          id="language"
          name="language"
          type="text"
          value={formData.language}
          onChange={handleChange}
          placeholder="Enter Language"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* PAN */}
        <label htmlFor="pan" className="text-sm font-medium text-gray-700">
          PAN
        </label>
        <input
          id="pan"
          name="pan"
          type="text"
          value={formData.pan}
          onChange={handleChange}
          placeholder="Enter PAN Number"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* GST */}
        <label htmlFor="gst" className="text-sm font-medium text-gray-700">
          GST
        </label>
        <input
          id="gst"
          name="gst"
          type="text"
          value={formData.gst}
          onChange={handleChange}
          placeholder="Enter GST Number"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Advance Amount */}
        <label
          htmlFor="advanceAmount"
          className="text-sm font-medium text-gray-700"
        >
          Advance Amount
        </label>
        <input
          id="advanceAmount"
          name="advanceAmount"
          type="number"
          value={formData.advanceAmount}
          onChange={handleChange}
          placeholder="Enter Advance Amount"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Address Sections */}
      <div className="mt-8">
        <h2 className="font-semibold text-lg mb-4">Address Information</h2>
        
        <div className="grid grid-cols-2 gap-10">
          {/* Billing Address */}
          <div>
            <h3 className="font-medium text-md mb-4 text-blue-600">Billing Address</h3>
            <div className="grid grid-cols-[180px_1fr] gap-y-4 items-center">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <input name="billingAddress.country" value={formData.billingAddress.country} onChange={handleChange} type="text" placeholder="Enter Country" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <label className="text-sm font-medium text-gray-700">Address Line 1</label>
              <input name="billingAddress.addressLine1" value={formData.billingAddress.addressLine1} onChange={handleChange} type="text" placeholder="Enter Address Line 1" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <label className="text-sm font-medium text-gray-700">Address Line 2</label>
              <input name="billingAddress.addressLine2" value={formData.billingAddress.addressLine2} onChange={handleChange} type="text" placeholder="Enter Address Line 2" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <label className="text-sm font-medium text-gray-700">City</label>
              <input name="billingAddress.city" value={formData.billingAddress.city} onChange={handleChange} type="text" placeholder="Enter City" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <label className="text-sm font-medium text-gray-700">State</label>
              <input name="billingAddress.state" value={formData.billingAddress.state} onChange={handleChange} type="text" placeholder="Enter State" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <label className="text-sm font-medium text-gray-700">Pincode</label>
              <input name="billingAddress.pincode" value={formData.billingAddress.pincode} onChange={handleChange} type="text" placeholder="Enter Pincode" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <div>
                <input name="billingAddress.phone" value={formData.billingAddress.phone} onChange={handleChange} type="text" placeholder="Enter Phone" className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['billingAddress.phone'] ? "border-red-500" : "border-gray-300"}`} />
                {errors['billingAddress.phone'] && <p className="text-red-500 text-xs mt-1">{errors['billingAddress.phone']}</p>}
              </div>
              
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div>
                <input name="billingAddress.email" value={formData.billingAddress.email} onChange={handleChange} type="email" placeholder="Enter Email" className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['billingAddress.email'] ? "border-red-500" : "border-gray-300"}`} />
                {errors['billingAddress.email'] && <p className="text-red-500 text-xs mt-1">{errors['billingAddress.email']}</p>}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="font-medium text-md text-green-600">Shipping Address</h3>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded" />
                Same as Billing Address
              </label>
            </div>
            <div className="grid grid-cols-[180px_1fr] gap-y-4 items-center">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <input name="shippingAddress.country" value={formData.shippingAddress.country} onChange={handleChange} type="text" placeholder="Enter Country" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <label className="text-sm font-medium text-gray-700">Address Line 1</label>
              <input name="shippingAddress.addressLine1" value={formData.shippingAddress.addressLine1} onChange={handleChange} type="text" placeholder="Enter Address Line 1" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <label className="text-sm font-medium text-gray-700">Address Line 2</label>
              <input name="shippingAddress.addressLine2" value={formData.shippingAddress.addressLine2} onChange={handleChange} type="text" placeholder="Enter Address Line 2" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <label className="text-sm font-medium text-gray-700">City</label>
              <input name="shippingAddress.city" value={formData.shippingAddress.city} onChange={handleChange} type="text" placeholder="Enter City" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <label className="text-sm font-medium text-gray-700">State</label>
              <input name="shippingAddress.state" value={formData.shippingAddress.state} onChange={handleChange} type="text" placeholder="Enter State" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <label className="text-sm font-medium text-gray-700">Pincode</label>
              <input name="shippingAddress.pincode" value={formData.shippingAddress.pincode} onChange={handleChange} type="text" placeholder="Enter Pincode" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <div>
                <input name="shippingAddress.phone" value={formData.shippingAddress.phone} onChange={handleChange} type="text" placeholder="Enter Phone" className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['shippingAddress.phone'] ? "border-red-500" : "border-gray-300"}`} />
                {errors['shippingAddress.phone'] && <p className="text-red-500 text-xs mt-1">{errors['shippingAddress.phone']}</p>}
              </div>
              
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div>
                <input name="shippingAddress.email" value={formData.shippingAddress.email} onChange={handleChange} type="email" placeholder="Enter Email" className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['shippingAddress.email'] ? "border-red-500" : "border-gray-300"}`} />
                {errors['shippingAddress.email'] && <p className="text-red-500 text-xs mt-1">{errors['shippingAddress.email']}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          type="submit"
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium cursor-pointer"
        >
          Create Customer
        </button>
      </div>
      </form>
    </div>
  );
};

export default CreateCustomerPage;