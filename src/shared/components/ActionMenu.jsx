import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdCheckCircle,
  MdDelete,
  MdEditDocument,
  MdMoreVert,
} from "react-icons/md";

const ActionMenu = ({ row, onEdit, onDelete, onActivate }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(row.original);
    }
    setOpen(false);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(row.original);
    }
    setOpen(false);
  };

  const handleActivate = () => {
    if (onActivate) {
      onActivate(row.original);
    }
    setOpen(false);
  };

  return (
    <div
      ref={menuRef}
      className="relative inline-block"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Three dots */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 rounded hover:bg-gray-100"
      >
        <MdMoreVert size={20} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
          >
            <MdEditDocument className="text-yellow-500" />
            Edit
          </button>

          {row.original.isActive ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              <MdDelete className="text-red-500" />
              Deactivate
            </button>
          ) : (
            <button
              onClick={handleActivate}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              <MdCheckCircle className="text-green-600" />
              Activate
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
