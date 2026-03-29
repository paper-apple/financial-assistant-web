// src/components/Modal.tsx
import { type ReactNode, useEffect, useRef, useId, useState } from "react";
import { addModalToStack, removeModalFromStack, getTopModalId } from "../../utils/modalStack";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { TranslationKey, useTranslation } from "../../hooks/useTranslation";

type Props = {
  onRemoveModal: () => void;
  children: ReactNode;
  title?: TranslationKey;
  calendar?: boolean;
  isModalOpen: boolean;
  onModalClose: () => void;
};

export const Modal = ({ onRemoveModal: onRemove, title, children, calendar, isModalOpen, onModalClose }: Props) => {
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
        onRemove();
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
      className={`
        fixed inset-0 z-50 flex items-center justify-center
        modal-no-scale bg-(--modal-bg)/30 backdrop-blur-xs
        ${isModalOpen ? "modal-in" : "modal-out"}
      `}
      onAnimationEnd={(e) => {
        if (!isModalOpen && e.target === e.currentTarget) {
          onRemove();
        }
      }}
      onClick={onModalClose}
    >
      <div
        className={`
          bg-(--bg-secondary) rounded-lg p-3 w-full max-w-sm mx-auto shadow-md border border-(--modal-border)
          ${isModalOpen ? "modal-in" : "modal-out"}
        `}
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