// TopActionBar.tsx
import { useEffect, useState } from "react";
import { getSelectionText } from "../utils/getSelectionText";

type Props = {
  selectedCount: number;
  totalCount: number;
  selectionMode: boolean;
  onSelectAll: () => void;
  onDelete: () => void;
  onCancel: () => void;
};

export const TopActionBar = ({
  selectedCount,
  totalCount,
  selectionMode,
  onSelectAll,
  onDelete,
  onCancel
}: Props) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  });

  useEffect(() => {
    if (selectedCount === 0) {
      setConfirmDelete(false)
    }
  }, [selectedCount]);

    const [showBorder, setShowBorder] = useState(false);

  useEffect(() => {
    if (selectionMode) {
      setShowBorder(true);
    } else {
      const timer = setTimeout(() => setShowBorder(false), 600);
      return () => clearTimeout(timer);
    }
  }, [selectionMode]);

  return (
    <div 
      className={`fixed max-w-screen-sm mx-18 top-0 left-0 right-0 z-40 px-4 
        bg-gray-100 overflow-hidden border-x border-gray-400 rounded-b-xl shadow-md transition-[max-height] duration-700 ease-initial ${
        selectionMode ? "max-h-32" : "max-h-0"
      } ${
        showBorder ? "border-b" : ""
      }`}
    >
      {!confirmDelete ? (
        // Обычный режим
        <div 
          key="normal" 
          className="flex justify-between py-2 items-center"
        >
          <span className="label-text">
            {getSelectionText(selectedCount, confirmDelete)}
          </span>
          <div className="space-x-2">
            <button
              onClick={onSelectAll}
              className="btn-base btn-confirm"
            >
              {selectedCount === totalCount ? "Снять всё" : "Выделить всё"}
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={selectedCount === 0}
              className={`btn-base ${selectedCount !== 0 ? "btn-delete" : "btn-disabled"}`}
            >
              Удалить
            </button>
            <button
              onClick={onCancel}
              className="btn-base btn-cancel"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        // Режим подтверждения
        <div key="confirm" className="flex justify-between items-center py-2">
          <span className="label-text">
            {getSelectionText(selectedCount, confirmDelete)}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => {
                onDelete();
                setConfirmDelete(false);
              }}
              className="btn-base btn-delete"
            >
              Да
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="btn-base btn-cancel"
            >
              Нет
            </button>
          </div>
        </div>
      )}
    </div>
  );
};