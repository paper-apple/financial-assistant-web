// src/components/Modal.tsx
import { type ReactNode, useEffect, useRef, useId } from "react";
import { addModalToStack, removeModalFromStack, getTopModalId } from "../utils/modalStack";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

type Props = {
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

export const Modal = ({ onClose, title, children }: Props) => {
  const titleId = useId(); // Генерируем уникальный ID
  useBodyScrollLock();
  const modalIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (modalIdRef.current === null) {
      const id = addModalToStack();
      modalIdRef.current = id;
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalIdRef.current === getTopModalId()) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      if (modalIdRef.current !== null) {
        removeModalFromStack(modalIdRef.current);
        modalIdRef.current = null;
      }
    };
    
  });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-4 w-full max-w-md mx-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        {title && (
          <h3 id={titleId} className="text-lg font-semibold mb-3 text-center">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};