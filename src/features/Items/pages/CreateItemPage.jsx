import { useCreateItemPage } from '../hooks/useCreateItemPage';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import InputField from '../../../shared/components/InputField';
import SelectField from '../../../shared/components/SelectField';
import { nameRegex, priceRegex } from '../../../shared/utils/regex';

const CreateItemPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    file,
    errors,
    loading,
    handleInputChange: originalHandleInputChange,
    handleFileChange,
    createItem
  } = useCreateItemPage();

  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    originalHandleInputChange(e);
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleBlur = (name, errorMsg) => {
    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const allErrors = { ...errors, ...fieldErrors };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const validationErrors = {};
    if (!formData.itemName?.trim()) {
      validationErrors.itemName = "Item name is required.";
    }
    if (!formData.itemType) {
      validationErrors.itemType = "Item type is required.";
    }
    if (!formData.salesPrice?.trim() && !formData.purchasePrice?.trim()) {
      validationErrors.salesPrice = "Either sales price or purchase price is required.";
      validationErrors.purchasePrice = "Either sales price or purchase price is required.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      return;
    }

    const result = await createItem();
    if (result?.success) {
      alert('Item created successfully!');
      navigate('/admin/items');
    } else {
      alert(result?.message || 'Failed to create item. Please try again.');
    }
  };

  const itemTypeOptions = [
    { key: 'goods', value: 'GOODS' },
    { key: 'service', value: 'SERVICE' }
  ];

  const unitOptions = [
    { key: 'pcs', value: 'PCS' },
    { key: 'liter', value: 'LITER' },
    { key: 'gram', value: 'GRAM' },
    { key: 'meter', value: 'METER' },
    { key: 'inch', value: 'INCH' },
    { key: 'kg', value: 'KG' },
    { key: 'milliliter', value: 'MILLILITER' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Item</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            regex={nameRegex}
            regexError="Item name cannot contain numbers."
            placeholder="Enter item name"
            error={allErrors.itemName}
            required
          />

          <SelectField
            label="Item Type"
            name="itemType"
            value={formData.itemType}
            onChange={handleInputChange}
            options={itemTypeOptions}
            error={allErrors.itemType}
            required
          />

          <SelectField
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            options={unitOptions}
          />

          <InputField
            label="Sales Price"
            name="salesPrice"
            type="number"
            value={formData.salesPrice}
            onChange={handleInputChange}
            onBlur={handleBlur}
            regex={priceRegex}
            regexError="Please enter a valid price."
            placeholder="0.00"
            error={allErrors.salesPrice}
          />

          <InputField
            label="Purchase Price"
            name="purchasePrice"
            type="number"
            value={formData.purchasePrice}
            onChange={handleInputChange}
            onBlur={handleBlur}
            regex={priceRegex}
            regexError="Please enter a valid price."
            placeholder="0.00"
            error={allErrors.purchasePrice}
          />

          <InputField
            label="HSN Code"
            name="hsnCode"
            value={formData.hsnCode}
            onChange={handleInputChange}
            placeholder="Enter HSN code"
          />

          <InputField
            label="Tax Rate (%)"
            name="taxRate"
            type="number"
            value={formData.taxRate}
            onChange={handleInputChange}
            placeholder="0.00"
          />

          <InputField
            label="Preferred Customer ID"
            name="preferredCustomerId"
            type="number"
            value={formData.preferredCustomerId}
            onChange={handleInputChange}
            placeholder="Enter customer ID"
          />

          <InputField
            label="Preferred Vendor ID"
            name="preferredVendorId"
            type="number"
            value={formData.preferredVendorId}
            onChange={handleInputChange}
            placeholder="Enter vendor ID"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Sales Description</label>
            <textarea
              name="salesDescription"
              value={formData.salesDescription}
              onChange={handleInputChange}
              placeholder="Enter sales description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Purchase Description</label>
            <textarea
              name="purchaseDescription"
              value={formData.purchaseDescription}
              onChange={handleInputChange}
              placeholder="Enter purchase description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Item Image</label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {file && <p className="text-sm text-gray-600 mt-1">Selected: {file.name}</p>}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Item'}
          </button>
          
          <button
            type="button"
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateItemPage;