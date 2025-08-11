// src/components/Modal.tsx
import { type ReactNode, useEffect, useRef } from "react";
import { addModalToStack, removeModalFromStack, getTopModalId } from "../utils/modalStack";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ isOpen, onClose, children }: Props) => {
  useBodyScrollLock(isOpen);
  const modalIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen && modalIdRef.current === null) {
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
    
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-4 w-full max-w-md mx-auto shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};