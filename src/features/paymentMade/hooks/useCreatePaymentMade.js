import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { coreApi } from "../../../shared/services/coreApi";

const PAYMENT_MODES = [
  "BANK_TRANSFER",
  "CASH",
  "UPI",
  "CARD",
  "CHEQUE",
  "NET_BANKING",
];

const toDateTimeLocal = (value) => {
  if (!value) return "";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return "";
  const offset = dt.getTimezoneOffset() * 60 * 1000;
  const local = new Date(dt.getTime() - offset);
  return local.toISOString().slice(0, 16);
};

const useCreatePaymentMade = (paymentId = null) => {
  const [companyId, setCompanyId] = useState("");
  const [allVendors, setAllVendors] = useState([]);
  const [unpaidOrders, setUnpaidOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(Boolean(paymentId));
  const [existingPayment, setExistingPayment] = useState(null);

  const [formData, setFormData] = useState({
    vendorId: "",
    amount: "",
    paymentDate: toDateTimeLocal(new Date()),
    modeOfPayment: "BANK_TRANSFER",
    referenceNumber: "",
    paymentRemarks: "",
    orderAllocations: [],
  });

  const decodeCompanyId = () => {
    const token = localStorage.getItem("token");
    if (!token) return "";
    const decoded = jwtDecode(token);
    return decoded?.defaultComp?.[0] || "";
  };

  const fetchVendors = async (compId) => {
    try {
      const res = await coreApi.getAllVendorByCompanyId(compId);
      setAllVendors(res?.data?.responseData || []);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);
      setAllVendors([]);
    }
  };

  const fetchUnpaidOrders = async (compId, vendorId) => {
    if (!compId || !vendorId) {
      setUnpaidOrders([]);
      return;
    }
    try {
      const res = await coreApi.getVendorUnpaidOrders(compId, vendorId);
      setUnpaidOrders(res?.data?.responseData || []);
    } catch (error) {
      console.error("Failed to fetch unpaid orders:", error);
      setUnpaidOrders([]);
    }
  };

  const fetchPaymentDetail = async (compId, pid) => {
    try {
      const res = await coreApi.getPaymentDetail(compId, pid);
      const data = res?.data?.responseData;
      if (!data) return;

      setExistingPayment(data);
      setFormData({
        vendorId: data.vendorId ? String(data.vendorId) : "",
        amount: String(data.amount || ""),
        paymentDate: toDateTimeLocal(data.paymentDate),
        modeOfPayment: data.modeOfPayment || "BANK_TRANSFER",
        referenceNumber: data.referenceNumber || "",
        paymentRemarks: data.paymentRemarks || "",
        orderAllocations: (data.orderAllocations || []).map((a) => ({
          paymentOrderAllocationId: a.paymentOrderAllocationId,
          orderId: a.orderId ? String(a.orderId) : "",
          amountApplied: String(a.amountApplied || ""),
          allocationDate: toDateTimeLocal(a.allocationDate || data.paymentDate),
          allocationRemarks: a.allocationRemarks || "",
          orderNumber: a.orderNumber || "",
        })),
      });

      if (data.vendorId) {
        fetchUnpaidOrders(compId, data.vendorId);
      }
    } catch (error) {
      console.error("Failed to fetch payment details:", error);
    }
  };

  useEffect(() => {
    const compId = decodeCompanyId();
    if (!compId) return;
    setCompanyId(compId);
    fetchVendors(compId);
  }, []);

  useEffect(() => {
    if (!paymentId || !companyId) return;
    setIsEditMode(true);
    fetchPaymentDetail(companyId, paymentId);
  }, [paymentId, companyId]);

  useEffect(() => {
    if (isEditMode) return;
    if (!companyId || !formData.vendorId) return;
    fetchUnpaidOrders(companyId, formData.vendorId);
  }, [companyId, formData.vendorId, isEditMode]);

  const orderOptions = useMemo(() => {
    const map = new Map();
    unpaidOrders.forEach((o) => {
      map.set(String(o.orderId), {
        orderId: String(o.orderId),
        label: `${o.orderNumber} (Due: ${Number(o.totalAmount || 0).toFixed(2)})`,
      });
    });
    formData.orderAllocations.forEach((a) => {
      if (!a.orderId) return;
      if (!map.has(a.orderId)) {
        map.set(a.orderId, {
          orderId: a.orderId,
          label: a.orderNumber || `Order #${a.orderId}`,
        });
      }
    });
    return Array.from(map.values());
  }, [unpaidOrders, formData.orderAllocations]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addAllocation = () => {
    setFormData((prev) => ({
      ...prev,
      orderAllocations: [
        ...prev.orderAllocations,
        {
          paymentOrderAllocationId: null,
          orderId: "",
          amountApplied: "",
          allocationDate: prev.paymentDate,
          allocationRemarks: "",
          orderNumber: "",
        },
      ],
    }));
  };

  const updateAllocation = (index, field, value) => {
    setFormData((prev) => {
      const next = [...prev.orderAllocations];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, orderAllocations: next };
    });
  };

  const removeAllocation = async (index) => {
    const target = formData.orderAllocations[index];
    if (!target) return;

    if (isEditMode && target.paymentOrderAllocationId) {
      if (!window.confirm("Delete this allocation from payment?")) return;
      try {
        await coreApi.deletePaymentSentAllocation(
          companyId,
          paymentId,
          target.paymentOrderAllocationId
        );
      } catch (error) {
        alert(error?.response?.data?.responseMessage || "Failed to delete allocation");
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      orderAllocations: prev.orderAllocations.filter((_, i) => i !== index),
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.vendorId) {
      nextErrors.vendorId = "Vendor is required";
    }
    if (!Number(formData.amount) || Number(formData.amount) <= 0) {
      nextErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.paymentDate) {
      nextErrors.paymentDate = "Payment date is required";
    }
    if (!formData.modeOfPayment) {
      nextErrors.modeOfPayment = "Mode of payment is required";
    }

    formData.orderAllocations.forEach((a, idx) => {
      if (!a.orderId) nextErrors[`orderId_${idx}`] = "Order is required";
      if (!Number(a.amountApplied) || Number(a.amountApplied) <= 0) {
        nextErrors[`amountApplied_${idx}`] = "Amount must be greater than 0";
      }
      if (!a.allocationDate) {
        nextErrors[`allocationDate_${idx}`] = "Allocation date is required";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const getAllocationsPayload = () =>
    formData.orderAllocations.map((a) => ({
      ...(a.paymentOrderAllocationId
        ? { paymentOrderAllocationId: Number(a.paymentOrderAllocationId) }
        : {}),
      orderId: Number(a.orderId),
      amountApplied: Number(a.amountApplied),
      allocationDate: a.allocationDate,
      allocationRemarks: a.allocationRemarks || null,
    }));

  const submitPayment = async () => {
    if (!validate()) return { success: false };
    setLoading(true);

    try {
      const baseDetails = {
        amount: Number(formData.amount),
        paymentDate: formData.paymentDate,
        modeOfPayment: formData.modeOfPayment,
        referenceNumber: formData.referenceNumber || null,
        paymentRemarks: formData.paymentRemarks || null,
      };
      const allocations = getAllocationsPayload();

      let createdPaymentId = paymentId;
      if (isEditMode) {
        await coreApi.updatePaymentSent(companyId, paymentId, {
          ...baseDetails,
          ...(allocations.length ? { orderAllocations: allocations } : {}),
        });
      } else {
        const createRes = await coreApi.createPaymentSent(companyId, {
          vendorId: Number(formData.vendorId),
          paymentDetails: {
            ...baseDetails,
            ...(allocations.length ? { orderAllocations: allocations } : {}),
          },
        });
        createdPaymentId =
          createRes?.data?.responseData?.paymentId ??
          createRes?.data?.responseData?.id ??
          null;
      }

      return { success: true, paymentId: createdPaymentId };
    } catch (error) {
      return {
        success: false,
        message:
          error?.response?.data?.responseMessage ||
          `Failed to ${isEditMode ? "update" : "create"} payment`,
      };
    } finally {
      setLoading(false);
    }
  };

  const totalAllocated = formData.orderAllocations.reduce(
    (sum, a) => sum + Number(a.amountApplied || 0),
    0
  );

  return {
    companyId,
    allVendors,
    unpaidOrders,
    orderOptions,
    loading,
    errors,
    isEditMode,
    paymentModes: PAYMENT_MODES,
    formData,
    existingPayment,
    totalAllocated,
    handleInputChange,
    addAllocation,
    updateAllocation,
    removeAllocation,
    submitPayment,
  };
};

export default useCreatePaymentMade;
