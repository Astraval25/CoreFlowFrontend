import { useEffect, useState } from "react";
import { coreApi } from "../../../shared/services/coreApi";
import { jwtDecode } from "jwt-decode";

const useCreateEmployee = (employeeId) => {
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    employeeCode: "",
    employeeName: "",
    phone: "",
    email: "",
    designation: "",
    joinedDt: "",
    salaryType: "MONTHLY",
    monthlyAmount: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const compId = decode.defaultComp[0];
    setCompanyId(compId);

    if (employeeId) {
      coreApi
        .getEmployeeDetail(compId, employeeId)
        .then((res) => {
          const d = res.data.responseData;
          if (d) {
            setFormData({
              employeeCode: d.employeeCode || "",
              employeeName: d.employeeName || "",
              phone: d.phone || "",
              email: d.email || "",
              designation: d.designation || "",
              joinedDt: d.joinedDt || "",
              salaryType: d.currentSalaryType || "MONTHLY",
              monthlyAmount: d.currentMonthlyAmount || "",
            });
          }
        })
        .catch((err) => console.error("Fetch employee detail error:", err));
    }
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const submitEmployee = async () => {
    const newErrors = {};
    if (!formData.employeeName) newErrors.employeeName = "Required";
    if (!formData.employeeCode) newErrors.employeeCode = "Required";
    if (!formData.joinedDt) newErrors.joinedDt = "Required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setLoading(true);
    try {
      if (employeeId) {
        await coreApi.updateEmployee(companyId, employeeId, {
          employeeName: formData.employeeName,
          phone: formData.phone,
          email: formData.email,
          designation: formData.designation,
          joinedDt: formData.joinedDt,
        });
      } else {
        await coreApi.createEmployee(companyId, {
          ...formData,
          monthlyAmount: Number(formData.monthlyAmount) || 0,
        });
      }
      return true;
    } catch (err) {
      const msg = err.response?.data?.responseMessage || "Failed to save employee.";
      setErrors({ submit: msg });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { formData, errors, loading, handleChange, submitEmployee, companyId };
};

export default useCreateEmployee;
