import { useEffect } from "react";
import Button, { CloseButton } from "@components/Button";

// Header & footer tetap, body scroll. Footer hanya muncul jika confirmLabel diisi.
const Modal = ({ title, onClose, confirmLabel, children }) => {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex max-h-[85vh] w-full max-w-md flex-col rounded-[10px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 id="modal-title" className="font-semibold">
            {title}
          </h2>
          <CloseButton onClick={onClose} />
        </div>
        <div className="max-h-[60vh] flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
        {confirmLabel && (
          <div className="border-t border-line px-5 py-3 text-right">
            <Button onClick={onClose}>{confirmLabel}</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
