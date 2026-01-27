import { useCreateItemPage } from '../hooks/useCreateItemPage';
import { useNavigate } from 'react-router-dom';
import InputField from '../../../shared/components/InputField';
import SelectField from '../../../shared/components/SelectField';

const CreateItemPage = () => {
  const navigate = useNavigate();
  const {
    formData,
    file,
    errors,
    loading,
    handleInputChange,
    handleFileChange,
    createItem
  } = useCreateItemPage();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            placeholder="Enter item name"
            error={errors.itemName}
            required
          />

          <SelectField
            label="Item Type"
            name="itemType"
            value={formData.itemType}
            onChange={handleInputChange}
            options={itemTypeOptions}
            required
          />

          <SelectField
            label="Unit"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
            options={unitOptions}
            required
          />

          <InputField
            label="Sales Price"
            name="salesPrice"
            type="number"
            value={formData.salesPrice}
            onChange={handleInputChange}
            placeholder="0.00"
          />

          <InputField
            label="Purchase Price"
            name="purchasePrice"
            type="number"
            value={formData.purchasePrice}
            onChange={handleInputChange}
            placeholder="0.00"
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