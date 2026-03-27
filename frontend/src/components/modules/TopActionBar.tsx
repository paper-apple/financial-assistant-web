// TopActionBar.tsx
import { useEffect, useState } from "react";
import { getSelectionText } from "../../utils/getSelectionText";
import { useTranslation } from "../../hooks/useTranslation";
import { useSettings } from "../../context/SettingsContext";
import { isSafari } from "../../utils/isSafari";
import { useScrollbar } from "../../hooks/useScrollbar";

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
  const [countForTop, setCountForTop] = useState(0);
  const { hasScrollbar, scrollbarWidth } = useScrollbar();
  const [showBorder, setShowBorder] = useState(false);
  const { language } = useSettings();

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

  // Кнопка "Удалить" становится недоступной
  useEffect(() => {
    if (selectedCount === 0) {
      setConfirmDelete(false)
    }
  }, [selectedCount]);


  useEffect(() => {
    if (selectionMode) {
      setShowBorder(true);
    } else {
      setShowBorder(false)
    }
  }, [selectionMode]);

  // Обновление количества выбранных записей только тогда, когда плашка открыта
  useEffect(() => {
    if (selectionMode) {
      setCountForTop(selectedCount);
    }
  }, [selectionMode, selectedCount]);

  const { t } = useTranslation();

  return (
    <div
      // Анимация появления плашки
      className={`
        fixed flex top-0 left-1/2 z-40
        transform -translate-x-1/2
        w-full max-w-screen-sm px-3.5
        overflow-hidden rounded-b-xl
        transition-[max-height] duration-500
        ${selectionMode ? "max-h-32" : "max-h-0"}
      `}
    >
      {!confirmDelete ? (
        <div 
          key="normal" 
          className={`flex justify-between items-center w-full py-2 px-2 border-x bg-(--bg-secondary) border-(--top-bar-border) rounded-b-lg
            ${showBorder ? "border-b" : ""}
          `}
          style={{
            marginLeft: !isSafari && hasScrollbar ? `${scrollbarWidth}px` : ''
          }}
        >
          <span // Отображение количества выбранных записей
            className="hidden sm:block label-text shrink-0 whitespace-nowrap mr-4">
            {getSelectionText(countForTop, confirmDelete, language)}
          </span>
          <div className="flex gap-2 flex-1 justify-end">
            <button
              onClick={onSelectAll}
              className="btn-base btn-confirm flex-1 min-w-0"
            >
                {countForTop === totalCount ? (
                  t('cancel_select')
                ) : (
                  <>
                    <span className="hidden sm:inline">{t('select_all')}</span>
                    <span className="inline sm:hidden">{t('select_all_short')}</span>
                  </>
                )}
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              disabled={countForTop === 0}
              className={`btn-base flex-1 min-w-0 ${
                countForTop !== 0 ? "btn-delete" : "btn-disabled"
              }`}
            >
              {t('delete')}
            </button>
            <button
              onClick={onCancel}
              className="btn-base btn-cancel flex-1 min-w-0"
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      ) : (
        <div key="confirm"
          className={`flex justify-between items-center w-full py-2 px-2 border-x bg-(--bg-secondary) border-(--top-bar-border) rounded-b-lg
            ${showBorder ? "border-b" : ""}
          `}
                      style={{
            marginLeft: !isSafari && hasScrollbar ? `${scrollbarWidth}px` : ''
          }}
        >
          <span className="label-text shrink-0 whitespace-nowrap mr-4">
            {getSelectionText(selectedCount, confirmDelete, language)}
          </span>
          <div className="flex gap-2 flex-1 justify-end">
            <button
              onClick={async() => {
                setSelectionMode(false)
                await onDelete();
              }}
              className="btn-base btn-delete flex-1 min-w-0"
            >
              {t('yes')}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="btn-base btn-cancel flex-1 min-w-0"
            >
              {t('no')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};