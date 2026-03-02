// TopActionBar.tsx
import { useEffect, useState } from "react";
import { getSelectionText } from "../utils/getSelectionText";

type Props = {
  selectedCount: number;
  totalCount: number;
  selectionMode: boolean;
  setSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectAll: () => void;
  onDelete: () => void;
  onCancel: () => void;
};

export const TopActionBar = ({
  selectedCount,
  totalCount,
  selectionMode,
  setSelectionMode,
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
      className={`
        fixed flex top-0 left-1/2 z-40
        transform -translate-x-1/2
        w-full max-w-screen-sm px-4
        overflow-hidden rounded-b-xl
        transition-[max-height] duration-500
        ${selectionMode ? "max-h-32" : "max-h-0"}
      `}
    >
      {!confirmDelete ? (
        <div 
          key="normal" 
          className={`flex justify-between items-center w-full py-2 px-2 border-x bg-white border-gray-400 rounded-b-lg
            ${showBorder ? "border-b" : ""}
          `}
        >
          <span className="hidden sm:block label-text flex-shrink-0 whitespace-nowrap mr-4">
            {getSelectionText(selectedCount, confirmDelete)}
          </span>
          <div className="flex gap-2 flex-1 justify-end">
            <button
              onClick={onSelectAll}
              className="btn-base btn-confirm flex-1 min-w-0"
            >
                {selectedCount === totalCount ? (
                  "Снять всё"
                ) : (
                  <>
                    <span className="hidden sm:inline">Выбрать всё</span>
                    <span className="inline sm:hidden">Выб. всё</span>
                  </>
                )}
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={selectedCount === 0}
              className={`btn-base flex-1 min-w-0 ${
                selectedCount !== 0 ? "btn-delete" : "btn-disabled"
              }`}
            >
              Удалить
            </button>
            <button
              onClick={onCancel}
              className="btn-base btn-cancel flex-1 min-w-0"
            >
              Отмена
            </button>
          </div>
        </div>
      ) : (
        <div key="confirm"
          className={`flex justify-between items-center w-full py-2 px-2 border-x bg-white border-gray-400 rounded-b-lg
            ${showBorder ? "border-b" : ""}
          `}
        >
          <span className="label-text flex-shrink-0 whitespace-nowrap mr-4">
            {getSelectionText(selectedCount, confirmDelete)}
          </span>
          <div className="flex gap-2 flex-1 justify-end">
            <button
              onClick={async() => {
                setSelectionMode(false)
                await onDelete();
              }}
              className="btn-base btn-delete flex-1 min-w-0"
            >
              Да
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="btn-base btn-cancel flex-1 min-w-0"
            >
              Нет
            </button>
          </div>
        </div>
      )}
    </div>
  );
};