import { MdClose, MdCloudUpload } from "react-icons/md";
import useCompanyDrawer from "./useCompanyDrawer";
import { useEffect, useRef, useState } from "react";
import { coreApi } from "../../shared/services/coreApi";

const CompanyDrawer = ({ open, onClose }) => {
  const { companies, uploadLogo, uploadingId } = useCompanyDrawer();
  const [copiedId, setCopiedId] = useState(null);
  const [logoUrls, setLogoUrls] = useState({});
  const fileInputs = useRef({});

  useEffect(() => {
    const fsIds = [...new Set(companies.map((c) => c.fsId).filter(Boolean))];
    if (fsIds.length === 0) {
      setLogoUrls({});
      return;
    }
    let cancelled = false;
    Promise.allSettled(
      fsIds.map((fsId) =>
        coreApi.downloadFile(fsId).then((r) => ({ fsId, url: URL.createObjectURL(r.data) }))
      )
    ).then((results) => {
      if (cancelled) return;
      const urls = {};
      results.forEach((r) => {
        if (r.status === "fulfilled") urls[r.value.fsId] = r.value.url;
      });
      setLogoUrls((prev) => {
        Object.values(prev).forEach((u) => URL.revokeObjectURL(u));
        return urls;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [companies]);

  useEffect(
    () => () => {
      Object.values(logoUrls).forEach((u) => URL.revokeObjectURL(u));
    },
    [logoUrls]
  );

  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleLogoClick = (companyId) => {
    fileInputs.current[companyId]?.click();
  };

  const handleFileChange = (companyId, e) => {
    const file = e.target.files?.[0];
    if (file) uploadLogo(companyId, file);
    e.target.value = "";
  };

  return (
    <>
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/30 z-40" />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-4 h-14 bg-gray-100">
          <h2 className="font-semibold text-gray-800">My Companies</h2>
          <button onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>

        <div className="space-y-3 overflow-y-auto">
          {companies.length === 0 && (
            <p className="text-sm text-gray-500">No companies found</p>
          )}

          {companies.map((company) => (
            <div
              key={company.companyId}
              className="p-3 hover:bg-gray-50 flex items-center gap-3"
            >
              <button
                type="button"
                onClick={() => handleLogoClick(company.companyId)}
                className="relative w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200"
                title="Upload / change logo"
              >
                {logoUrls[company.fsId] ? (
                  <img
                    src={logoUrls[company.fsId]}
                    alt={company.companyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-500">
                    {company.companyName?.[0]?.toUpperCase() || "?"}
                  </span>
                )}
                {uploadingId === company.companyId && (
                  <span className="absolute inset-0 bg-black/40 text-white text-[10px] flex items-center justify-center">
                    ...
                  </span>
                )}
                <span className="absolute bottom-0 right-0 bg-white rounded-full border border-gray-200 p-0.5">
                  <MdCloudUpload size={10} />
                </span>
              </button>
              <input
                ref={(el) => (fileInputs.current[company.companyId] = el)}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(company.companyId, e)}
              />
              <div
                className="flex-1 cursor-pointer"
                onClick={() => copyToClipboard(company.companyId)}
              >
                <p className="font-medium">{company.companyName}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Company Id: {company.companyId}
                  {copiedId === company.companyId && (
                    <span className="text-blue-500 font-medium ml-6">Copied!</span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CompanyDrawer;
