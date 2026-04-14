import { useEffect, useState } from "react";
import { coreApi } from "../../../shared/services/coreApi";
import { jwtDecode } from "jwt-decode";

const useCreateWorkDef = (workDefId) => {
  const [companyId, setCompanyId] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    workName: "",
    workCode: "",
    description: "",
    ratePerUnit: "",
    unit: "KG",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decode = jwtDecode(token);
    const compId = decode.defaultComp[0];
    setCompanyId(compId);

    if (workDefId) {
      coreApi
        .getWorkDefinitionDetail(compId, workDefId)
        .then((res) => {
          const d = res.data.responseData;
          if (d) {
            setFormData({
              workName: d.workName || "",
              workCode: d.workCode || "",
              description: d.description || "",
              ratePerUnit: d.ratePerUnit ?? "",
              unit: d.unit || "KG",
            });
          }
        })
        .catch((err) => console.error("Work def detail error:", err));
    }
  }, [workDefId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const submitWorkDef = async () => {
    const newErrors = {};
    if (!formData.workName) newErrors.workName = "Required";
    if (!formData.workCode) newErrors.workCode = "Required";
    if (!formData.ratePerUnit) newErrors.ratePerUnit = "Required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setLoading(true);
    try {
      const payload = {
        workName: formData.workName,
        workCode: formData.workCode,
        description: formData.description,
        ratePerUnit: Number(formData.ratePerUnit),
        unit: formData.unit,
      };
      if (workDefId) {
        await coreApi.updateWorkDefinition(companyId, workDefId, payload);
      } else {
        await coreApi.createWorkDefinition(companyId, payload);
      }
      return true;
    } catch (err) {
      const msg = err.response?.data?.responseMessage || "Failed to save work definition.";
      setErrors({ submit: msg });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { formData, errors, loading, handleChange, submitWorkDef, companyId };
};

export default useCreateWorkDef;
