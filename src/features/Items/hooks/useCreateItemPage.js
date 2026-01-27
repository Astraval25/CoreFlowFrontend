import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { coreApi } from '../../../shared/services/coreApi';

export const useCreateItemPage = () => {
  const [formData, setFormData] = useState({
    itemName: '',
    itemType: 'GOODS',
    unit: 'PCS',
    salesDescription: '',
    salesPrice: '',
    preferredCustomerId: '',
    purchaseDescription: '',
    purchasePrice: '',
    preferredVendorId: '',
    hsnCode: '',
    taxRate: ''
  });

  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required';
    }
    if (!formData.salesPrice && !formData.purchasePrice) {
      newErrors.salesPrice = 'Either sales price or purchase price is required';
      newErrors.purchasePrice = 'Either sales price or purchase price is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createItem = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const decode = jwtDecode(token);
      const companyId = decode.defaultComp[0];
      
      const formDataToSend = new FormData();
      formDataToSend.append('item', JSON.stringify(formData));
      if (file) {
        formDataToSend.append('file', file);
      }

      await coreApi.createItems(companyId, formDataToSend);

      setFormData({
        itemName: '',
        itemType: 'GOODS',
        unit: 'PCS',
        salesDescription: '',
        salesPrice: '',
        preferredCustomerId: '',
        purchaseDescription: '',
        purchasePrice: '',
        preferredVendorId: '',
        hsnCode: '',
        taxRate: ''
      });
      setFile(null);
      return { success: true };
    } catch (error) {
      console.error('Error creating item:', error);
      const errorMessage = error.response?.data?.responseMessage || 'Failed to create item. Please try again.';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    file,
    errors,
    loading,
    handleInputChange,
    handleFileChange,
    createItem
  };
};