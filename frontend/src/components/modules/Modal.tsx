// src/components/Modal.tsx
import { type ReactNode, useEffect, useRef, useId } from "react";
import { addModalToStack, removeModalFromStack, getTopModalId } from "../../utils/modalStack";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { TranslationKey, useTranslation } from "../../hooks/useTranslation";

type Props = {
  onModalClose: () => void;
  children: ReactNode;
  title?: TranslationKey;
  calendar?: boolean;
};

export const Modal = ({ onModalClose: onClose, title, children, calendar}: Props) => {
  const titleId = useId(); // Генерируется уникальный ID
  if (!calendar) {
    useBodyScrollLock(true);
  }
  const modalIdRef = useRef<number | null>(null);
  const { t } = useTranslation()
  
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
      className="fixed flex items-center justify-center bg-(--modal-bg)/30 backdrop-blur-xs inset-0 z-50"
      onClick={onClose}
    >
      <div
        className="bg-(--bg-secondary) rounded-lg p-3 w-full max-w-sm mx-auto shadow-md border border-(--modal-border)"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {title && (
          <h3 id={titleId} className="text-lg mb-2 text-(--text) text-center">
            {t(title)}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
};