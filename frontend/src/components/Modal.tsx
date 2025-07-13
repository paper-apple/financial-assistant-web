// src/components/Modal.tsx
import { type ReactNode, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: Props) => {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-4 w-full max-w-md mx-auto shadow-lg"
        onClick={(e) => e.stopPropagation()} // предотвращает закрытие при клике внутри
      >
        {children}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded"
        >
          Отмена
        </button>
      </div>
    </div>
  );
};
