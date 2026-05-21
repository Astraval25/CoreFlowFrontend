import { useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { MdArrowBack, MdCloudUpload } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { coreApi } from "../../../shared/services/coreApi";

const initialForm = {
  companyName: "",
  industry: "",
  shortName: "",
  pan: "",
  gstNo: "",
  hsnCode: "",
  contactPerson: "",
  contactEmail: "",
  contactPhone: "",
  website: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "",
  postalCode: "",
  publicDescription: "",
};

const OrganizationProfilePage = () => {
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoUrl, setLogoUrl] = useState("");
  const [settingsPath, setSettingsPath] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      if (decoded?.sub) {
        setSettingsPath(`/cf/user/${decoded.sub}/settings`);
      }
    } catch {
      setSettingsPath("");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadCompany = async () => {
      setLoading(true);
      try {
        const res = await coreApi.getCompanyById(companyId);
        const company = res?.data?.responseData;
        if (!company || cancelled) return;
        setFormData({
          companyName: company.companyName || "",
          industry: company.industry || "",
          shortName: company.shortName || "",
          pan: company.pan || "",
          gstNo: company.gstNo || "",
          hsnCode: company.hsnCode || "",
          contactPerson: company.contactPerson || "",
          contactEmail: company.contactEmail || "",
          contactPhone: company.contactPhone || "",
          website: company.website || "",
          addressLine1: company.addressLine1 || "",
          addressLine2: company.addressLine2 || "",
          city: company.city || "",
          state: company.state || "",
          country: company.country || "",
          postalCode: company.postalCode || "",
          publicDescription: company.publicDescription || "",
        });

        if (company.fsId) {
          const logoRes = await coreApi.downloadFile(company.fsId);
          if (!cancelled) {
            const url = URL.createObjectURL(logoRes.data);
            setLogoUrl((prev) => {
              if (prev) URL.revokeObjectURL(prev);
              return url;
            });
          }
        }
      } catch (error) {
        console.error("Failed to load organization profile:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCompany();
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  useEffect(() => {
    return () => {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [logoUrl]);

  const headerText = useMemo(() => formData.companyName || "Organization Profile", [formData.companyName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.companyName.trim()) nextErrors.companyName = "Company name is required";
    if (!formData.industry.trim()) nextErrors.industry = "Industry is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await coreApi.updateCompany(companyId, {
        ...formData,
        companyName: formData.companyName.trim(),
        industry: formData.industry.trim(),
      });
      navigate(settingsPath || -1);
    } catch (error) {
      setErrors({
        submit: error?.response?.data?.responseMessage || "Failed to update organization profile",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await coreApi.uploadCompanyLogo(companyId, file);
      const refreshed = await coreApi.getCompanyById(companyId);
      const fsId = refreshed?.data?.responseData?.fsId;
      if (fsId) {
        const logoRes = await coreApi.downloadFile(fsId);
        const url = URL.createObjectURL(logoRes.data);
        setLogoUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      }
    } catch (error) {
      setErrors({
        submit: error?.response?.data?.responseMessage || "Failed to upload logo",
      });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <button type="button" className="btn-ghost p-1.5" onClick={() => navigate(-1)}>
            <MdArrowBack size={18} />
          </button>
          <h1 className="text-sm font-bold text-app-text">{headerText}</h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-6">
        {errors.submit && <p className="text-xs p-3 rounded text-danger bg-danger-tint">{errors.submit}</p>}

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl border border-line bg-surface-soft overflow-hidden flex items-center justify-center">
            {logoUrl ? (
              <img src={logoUrl} alt="Company logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-app-sub">
                {formData.companyName?.[0]?.toUpperCase() || "C"}
              </span>
            )}
          </div>
          <label className="btn-ghost text-xs cursor-pointer">
            <MdCloudUpload size={14} />
            {uploading ? "Uploading..." : "Upload Logo"}
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Company Name *</label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`form-input text-xs w-full ${errors.companyName ? "border-danger" : ""}`}
            />
            {errors.companyName && <p className="text-xs mt-1 text-danger">{errors.companyName}</p>}
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Industry *</label>
            <input
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={`form-input text-xs w-full ${errors.industry ? "border-danger" : ""}`}
            />
            {errors.industry && <p className="text-xs mt-1 text-danger">{errors.industry}</p>}
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Short Name</label>
            <input name="shortName" value={formData.shortName} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">PAN</label>
            <input name="pan" value={formData.pan} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">GST No</label>
            <input name="gstNo" value={formData.gstNo} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">HSN Code</label>
            <input name="hsnCode" value={formData.hsnCode} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Contact Person</label>
            <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Contact Email</label>
            <input name="contactEmail" value={formData.contactEmail} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Contact Phone</label>
            <input name="contactPhone" value={formData.contactPhone} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-medium mb-1 block text-app-sub">Website</label>
            <input name="website" value={formData.website} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-medium mb-1 block text-app-sub">Address Line 1</label>
            <input name="addressLine1" value={formData.addressLine1} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div className="md:col-span-3">
            <label className="text-xs font-medium mb-1 block text-app-sub">Address Line 2</label>
            <input name="addressLine2" value={formData.addressLine2} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">City</label>
            <input name="city" value={formData.city} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">State</label>
            <input name="state" value={formData.state} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Postal Code</label>
            <input name="postalCode" value={formData.postalCode} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Country</label>
            <input name="country" value={formData.country} onChange={handleChange} className="form-input text-xs w-full" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium mb-1 block text-app-sub">Public Description</label>
            <textarea
              name="publicDescription"
              value={formData.publicDescription}
              onChange={handleChange}
              className="form-input text-xs w-full min-h-24 resize-y"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-outline text-xs">
            Cancel
          </button>
          <button type="submit" disabled={loading || saving} className="btn-primary text-xs">
            {saving ? "Saving..." : "Update Organization"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationProfilePage;
