// src/components/Modal.tsx
import { type ReactNode, useEffect, useRef, useId } from "react";
import { addModalToStack, removeModalFromStack, getTopModalId } from "../utils/modalStack";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

type Props = {
  onModalClose: () => void;
  children: ReactNode;
  title?: string;
  calendar?: boolean;
};

export const Modal = ({ onModalClose: onClose, title, children, calendar}: Props) => {
  const titleId = useId(); // Генерируется уникальный ID
  if (!calendar) {
    useBodyScrollLock();
  }
  const modalIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (modalIdRef.current === null) {
      const id = addModalToStack(); // Добавление номера модалки в список и его получение
      modalIdRef.current = id;
    }

    // Закрытие верхнего модального окна
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
      className="fixed inset-0 bg-gray-200/30 backdrop-blur-xs z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-3 w-full max-w-sm mx-auto shadow-md border border-gray-300"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {title && (
          <h3 id={titleId} className="text-lg mb-2 text-center border-b border-gray-400">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};