import { useNavigate, useParams } from "react-router-dom";
import useCreateWorkDef from "../hooks/useCreateWorkDef";
import { MdArrowBack } from "react-icons/md";

const UNITS = ["KG", "PC", "BOX", "LITER", "METER", "GRAM", "HOUR"];

const CreateWorkDefPage = () => {
  const navigate = useNavigate();
  const { companyId, workDefId } = useParams();
  const isEdit = !!workDefId;

  const { formData, errors, loading, handleChange, submitWorkDef } = useCreateWorkDef(workDefId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await submitWorkDef();
    if (ok) navigate(`/cf/company/${companyId}/work-definitions`);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="btn-ghost p-1.5"><MdArrowBack size={18} /></button>
        <h1 className="text-sm font-semibold text-app-text">{isEdit ? "Update Work Definition" : "Create Work Definition"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 max-w-2xl space-y-4">
        {errors.submit && <p className="text-xs p-3 rounded text-danger bg-danger-tint">{errors.submit}</p>}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Work Code <span className="text-danger">*</span></label>
            <input name="workCode" value={formData.workCode} onChange={handleChange} className="form-input text-xs w-full" />
            {errors.workCode && <p className="text-xs mt-1 text-danger">{errors.workCode}</p>}
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Work Name <span className="text-danger">*</span></label>
            <input name="workName" value={formData.workName} onChange={handleChange} className="form-input text-xs w-full" />
            {errors.workName && <p className="text-xs mt-1 text-danger">{errors.workName}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium mb-1 block text-app-sub">Description</label>
          <input name="description" value={formData.description} onChange={handleChange} className="form-input text-xs w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Rate Per Unit <span className="text-danger">*</span></label>
            <input name="ratePerUnit" type="number" step="0.01" value={formData.ratePerUnit} onChange={handleChange} className="form-input text-xs w-full" />
            {errors.ratePerUnit && <p className="text-xs mt-1 text-danger">{errors.ratePerUnit}</p>}
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block text-app-sub">Unit</label>
            <select name="unit" value={formData.unit} onChange={handleChange} className="form-input text-xs w-full">
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-outline text-xs">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary text-xs">{loading ? "Saving…" : isEdit ? "Update" : "Create"}</button>
        </div>
      </form>
    </div>
  );
};

export default CreateWorkDefPage;
