import { MdClose } from "react-icons/md";
import useCompanyDrawer from "./useCompanyDrawer";
import { useState } from "react";

const CompanyDrawer = ({ open, onClose }) => {
  const { companies } = useCompanyDrawer();
  const [copiedId, setCopiedId] = useState(null);
  const copyToClipboard = (id) => {
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000); // hide after 2s
    });
  };
  return (
    <>
      {/* Overlay */}
      {open && (
        <div onClick={onClose} className="fixed inset-0 bg-black/30 z-40" />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 bg-gray-100">
          <h2 className="font-semibold text-gray-800">My Companies</h2>
          <button onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 overflow-y-auto">
          {companies.length === 0 && (
            <p className="text-sm text-gray-500">No companies found</p>
          )}

          {companies.map((company, index) => (
            <div
              key={index}
              onClick={() => copyToClipboard(company.companyId)}
              className="p-3 hover:bg-gray-50 cursor-pointer"
            >
              <p className="font-medium">{company.companyName}</p>
              <p className="text-xs text-gray-500 mt-2">
                Company Id: {company.companyId}
                {copiedId === company.companyId && (
                  <span className="text-blue-500 font-medium ml-10">Copied!</span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CompanyDrawer;
