import { MdClose } from "react-icons/md";

const SideDetailDrawer = ({ title = "Details", open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-overlay" onClick={onClose}>
      <aside
        className="h-full w-[min(100vw,794px)] overflow-y-auto bg-surface shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-surface px-5 py-3">
          <p className="text-sm font-extrabold text-app-text">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-app-sub transition hover:bg-surface-soft"
            aria-label="Close details"
          >
            <MdClose size={18} />
          </button>
        </div>
        <div className="mx-auto min-h-full max-w-[794px] bg-surface">
          {children}
        </div>
      </aside>
    </div>
  );
};

export default SideDetailDrawer;
