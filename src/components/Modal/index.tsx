import { FC, ReactNode } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 relative">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          &#10005;
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
