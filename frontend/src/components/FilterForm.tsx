// FilterForm.tsx
import React, { useEffect, useRef } from 'react';
import type { FiltersState, Modals } from '../types';
import { handlePriceChange } from '../utils/sanitizePrice';
import { FormField } from './ui/FormField';
import { useFilterFormValidation } from '../hooks/useFilterFormValidation';

interface FilterFormProps {
  suggestions: string[];
  filtersState: FiltersState;
  handleAddKeyword: (word: string) => void;
  applyFilters: () => void;
  onModalOpen: (modal: keyof Modals) => void;
  onModalClose: () => void;
}

export const FilterForm: React.FC<FilterFormProps> = ({
  suggestions,
  filtersState,
  applyFilters,
  handleAddKeyword,
  onModalOpen: openModal,
  onModalClose: onClose
}) => {
  const {
    keywordInput, setKeywordInput,
    keywordsList, setKeywordsList,
    startDate, setStartDate,
    endDate, setEndDate,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    backup,
    restoreInitialValues,
    handleResetFilters,
  } = filtersState;

  useEffect(() => {
    backup();
  }, []);

  const { dateError, priceError, validateAndSubmit, isValid } =
    useFilterFormValidation({startDate, endDate, minPrice, maxPrice});

  const wasAppliedRef = useRef(false);

  const handleApply = () => {
    validateAndSubmit(() => {
      wasAppliedRef.current = true;
      applyFilters();
      onClose();
    });
  };

  // Восстановление кэшированных данных при закрытии окна 
  useEffect(() => {
    return () => {
      if (!wasAppliedRef.current) {
        restoreInitialValues();
      };
    }
  },[]);

  return (
    <div>
      {/* Ключевые слова */}
      <div className="mb-2 relative border-b-1">
        <div className="flex items-end gap-2 pb-2">
          <FormField
            label="Ключевые слова"
            name="keyword"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="...введите ключевое слово"
            suggestions={suggestions}
            onSuggestionSelect={(val) => handleAddKeyword(val)}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setKeywordsList([])} className="w-full btn-base btn-cancel">
            Очистить список
          </button>
          <button onClick={() => handleAddKeyword(keywordInput)} className="w-full btn-base btn-confirm">
            Добавить слово
        </button>
      </div>
        <div className="rounded mt-2 flex flex-wrap items-start gap-1 min-h-[88px] max-h-[88px] overflow-y-auto">
          {keywordsList.length > 0 ? (
            keywordsList.map((word) => (
              <span
                key={word}
                className="inline-flex items-center h-8 bg-blue-200 text-blue-800 text-sm px-2 rounded"
              >
                {word}
                <button
                  onClick={() =>
                    setKeywordsList((prev) => prev.filter((k) => k !== word))
                  }
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm w-full text-center pt-7">Ключевые слова не добавлены</span>
          )}
        </div>
      </div>

      {/* Даты */}
      <div className="mb-2 border-b">
        <label className="text-left">Интервал времени</label>
        <div className="grid grid-cols-2 gap-2">
          <FormField
            name="startDate"
            testId="input-date"
            value={
              startDate
                ? startDate.toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""
            }
            placeholder={'От'}
            error={dateError}
            readOnly
            showCalendarIcon
            onFieldClick={() => openModal("startDate")}
            onClear={() => setStartDate(null)}
          />

          <FormField
            name="endDate"
            value={
              endDate
                ? endDate.toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : ""
            }
            placeholder={'До'}
            error={dateError}
            readOnly
            showCalendarIcon
            onFieldClick={() => openModal("endDate")}
            onClear={() => setEndDate(null)}
          />
        </div>
        <div className="my-1 min-h-[26px] max-h-[26px] overflow-y-auto text-red-400 text-center">
          {dateError && (
            <p>Начало отсчёта позже конца</p>
          )}
        </div>
      </div>

      {/* Цены */}
      <div className="mb-2">
        <label className="label-text">Диапазон цен</label>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              name="startDate"
              value={minPrice}
              onChange={e => handlePriceChange(e.target.value, setMinPrice)}
              placeholder={'От'}
              error={priceError}
            />

            <FormField
              name="endDate"
              value={maxPrice}
              onChange={e => handlePriceChange(e.target.value, setMaxPrice)}
              placeholder={'До'}
              error={priceError}
            />
          </div>
        <div className="my-1 min-h-[26px] max-h-[26px] overflow-y-auto text-red-400 text-center">
          {priceError && (
            <p>Минимальная цена больше максимальной</p>
          )}
        </div>
      </div>

      {/* Кнопки */}
      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="btn-base btn-cancel">Отмена</button>
        <button onClick={handleResetFilters} className="btn-base btn-cancel">Сбросить</button>
        <button onClick={handleApply} className={`btn-base
          ${ isValid() ? "btn-confirm" : "btn-disabled"}`}>
            Применить
        </button>
      </div>
    </div>
  );
};
