import { useState, useRef, useEffect, useLayoutEffect } from "react";
import {
  MdCheckCircle,
  MdDelete,
  MdEditDocument,
  MdMoreVert,
} from "react-icons/md";

const ActionMenu = ({ row, onEdit, onDelete, onActivate }) => {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);

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

  /* ---------- close outside click ---------- */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ---------- auto position logic ---------- */
  useLayoutEffect(() => {
    if (open && menuRef.current && dropdownRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const dropdownHeight = dropdownRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < dropdownHeight;
      const top = openUp ? rect.top - dropdownHeight - 8 : rect.bottom + 8;
      setCoords({
        top,
        left: rect.right - 160, // width = w-40 (160px)
      });
    }
  }, [open]);

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
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
          }}
          className="w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]"
        >
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
