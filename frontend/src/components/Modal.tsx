// src/components/Modal.tsx
import { type ReactNode, useEffect, useRef, useId } from "react";
import { addModalToStack, removeModalFromStack, getTopModalId } from "../utils/modalStack";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

type Props = {
  onModalClose: () => void;
  children: ReactNode;
  title?: string;
};

export const Modal = ({ onModalClose: onClose, title, children }: Props) => {
  const titleId = useId(); // Генерируется уникальный ID
  useBodyScrollLock();
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
      className="fixed inset-0  bg-gray-900/70 bg-opacity-30 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-3 w-full max-w-sm mx-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {title && (
          <h3 id={titleId} className="text-lg font-semibold pb-2 mb-2 text-center border-b text-gray-700">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};