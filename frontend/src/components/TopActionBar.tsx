// TopActionBar.tsx
import { useEffect, useState } from "react";
import { getSelectionText } from "../utils/getSelectionText";

type Props = {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDelete: () => void;
  onCancel: () => void;
};

export const TopActionBar = ({
  selectedCount,
  totalCount,
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

  return (
    <div className="fixed max-w-screen-sm mx-auto top-0 left-0 right-0 z-40 p-2 px-4 bg-gray-100 border-b">
      {!confirmDelete ? (
        // Обычный режим
        <div key="normal" className="flex justify-between items-center">
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
        <div key="confirm" className="flex justify-between items-center">
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
