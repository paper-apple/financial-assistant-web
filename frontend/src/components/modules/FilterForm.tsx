// FilterForm.tsx
import React, { useEffect, useRef, useState } from 'react';
import type { FiltersState, Modals } from '../../types';
import { handlePriceChange } from '../../utils/sanitizePrice';
import { FormField } from '../ui/FormField';
import { useFilterFormValidation } from '../../hooks/useFilterFormValidation';
import { ErrorBar } from './ErrorBar';

interface FilterFormProps {
  suggestions: string[];
  filtersState: FiltersState;
  handleAddKeyword: (word: string) => void;
  applyFilters: () => void;
  onModalOpen: (modal: keyof Modals) => void;
  onModalClose: () => void;
}

const errorText: string = "min-h-[26px] max-h-[26px] overflow-y-auto text-red-400 text-center"

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

  // const getCombinedErrorText = () => {
  //   const errors = [];
  //   if (priceError) errors.push("Некорректная цена");
  //   if (dateError) errors.push("Некорректная дата");
  //   return errors.length > 0 ? errors.join(" ") : "";
  // };

// const [activeError, setActiveError] = useState<string | null>(null);
// const [errorQueue, setErrorQueue] = useState<string[]>([]);

  const [showErrorTooltip, setShowErrorTooltip] = useState(false);

  const getCombinedErrorText = () => {
    const errors = [];
    if (priceError) errors.push("Некорректная цена");
    if (dateError) errors.push("Некорректная дата");
    return errors.length > 0 ? errors.join("\n") : "";
  };

  const handleApply = () => {
    if (!isValid()) {
      setShowErrorTooltip(true);
    }
    validateAndSubmit(() => {
      wasAppliedRef.current = true;
      applyFilters();
      onClose();
    });
  };

  useEffect(() => {
    return () => {
      if (!wasAppliedRef.current) {
        restoreInitialValues();
      };
    }
  },[]);

  useEffect(() => {
    if (showErrorTooltip) {
      const timer = setTimeout(() => {
        setShowErrorTooltip(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showErrorTooltip]);

  return (
    <div>
      <label className="label-text">Поиск по ключевому слову</label>
      <div className="mb-2 p-2 relative rounded-lg border border-gray-400">
        <div className="flex items-end gap-2 pb-2">
          <FormField
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="...введите слово целиком или его часть"
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
        <div className="absolute left-0 right-0 mt-2 h-px bg-gray-400"/>
        <div className="rounded-lg mt-2 py-2 flex flex-wrap items-start gap-1 min-h-[88px] max-h-[88px] overflow-y-auto">
          {keywordsList.length > 0 ? (
            keywordsList.map((word) => (
              <span
                key={word}
                className="inline-flex items-center h-8 border border-gray-400 text-gray-500 text-sm font-semibold tracking-wide px-2 rounded-md"
              >
                <button
                  onClick={() =>
                    setKeywordsList((prev) => prev.filter((k) => k !== word))
                  }
                  className="text-gray-500 text-sm font-semibold tracking-wide cursor-pointer" 
                >
                  {word} ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm w-full text-center pt-7">Ключевые слова не добавлены</span>
          )}
        </div>
      </div>

      <div>
        <label className="label-text">Интервал времени</label>
        <div className="grid grid-cols-2 gap-4 mb-2">
          <FormField
            testId="input-date-from"
            value={
              startDate
                ? startDate.toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).replace(',', '')
                : ""
            }
            placeholder={'От'}
            error={dateError}
            readOnly
            calendarOpen={() => openModal("startDate")}
            onClear={() => setStartDate(null)}
          />
          <FormField
            testId="input-date-to"
            value={
              endDate
                ? endDate.toLocaleString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).replace(',', '')
                : ""
            }
            placeholder={'До'}
            error={dateError}
            readOnly
            calendarOpen={() => openModal("endDate")}
            onClear={() => setEndDate(null)}
          />
        </div>
        {/* <div className={errorText}>
          {dateError && (
            <p>Начало отсчёта позже конца</p>
          )}
        </div> */}
      </div>

      <div>
        <label className="label-text">Диапазон цен</label>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              value={minPrice}
              onChange={e => handlePriceChange(e.target.value, setMinPrice)}
              placeholder={'От'}
              error={priceError}
            />
            <FormField
              value={maxPrice}
              onChange={e => handlePriceChange(e.target.value, setMaxPrice)}
              placeholder={'До'}
              error={priceError}
            />
          </div>
        {/* <div className={errorText}>
          {priceError && (
            <p>Минимальная цена больше максимальной</p>
          )}
        </div> */}
      </div>
            {/* <div className="relative">
              {getCombinedErrorText() && (
                <ErrorBar errorText={getCombinedErrorText()}/>
                // <div className="py-2 px-3 bg-red-50 border border-red-200 rounded-lg">
                //   <p className="text-sm text-red-600 text-center">
                //     Пожалуйста, заполните все обязательные поля
                //   </p>
                // </div>
              )}
            </div> */}
      <div className="relative">
        {showErrorTooltip && (
          <div>
          <ErrorBar errorText={getCombinedErrorText()}/>
            {/* <div className="py-2 px-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">
                Пожалуйста, заполните все обязательные поля
              </p>
          </div> */}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
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