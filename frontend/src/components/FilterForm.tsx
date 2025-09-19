import React, { useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import { ru } from 'date-fns/locale';
import type { FiltersState, Modals } from '../types';
import { handlePriceChange } from '../utils/sanitizePrice';
import { FormField } from './ui/FormField';
import { useKeywordSuggestions } from '../hooks/useKeywordSuggestions';
import { useFilterFormValidation } from '../hooks/useFilterFormValidation';

interface FilterFormProps {
  suggestions: string[];
  filtersState: FiltersState;
  handleAddKeyword: (word: string) => void;
  applyFilters: () => void;
  handleReset: () => void;
  onModalOpen: (modal: keyof Modals) => void;
  onModalClose: () => void;
}

export const FilterForm: React.FC<FilterFormProps> = ({
  suggestions,
  filtersState,
  applyFilters,
  handleAddKeyword,
  handleReset,
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
  } = filtersState;

  const initialValuesRef = useRef<{
    keywordsList: string[];
    startDate: Date | null;
    endDate: Date | null;
    minPrice: string;
    maxPrice: string;
  } | null>(null);


  useEffect(() => {
    initialValuesRef.current = {
      keywordsList: [...keywordsList], // копия массива
      startDate,
      endDate,
      minPrice,
      maxPrice,
    };
  }, []);


  const { dateError, priceError, validateAndSubmit, isValid } =
    useFilterFormValidation({startDate, endDate, minPrice, maxPrice});

  const handleApply = () => {
    validateAndSubmit(() => {
      applyFilters();
      onClose();
    });
  };

  return (
    <div>
      {/* Ключевые слова */}
      <div className="mb-2 relative border-b-1">
        <div className="flex items-end gap-2 mb-2">
          <FormField
            label="Ключевые слова"
            name="keyword"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="Введите ключевое слово"
            suggestions={suggestions}
            onSuggestionSelect={(val) => handleAddKeyword(val)}
            onKeywordAdd={() => handleAddKeyword(keywordInput)} // 👈 передаём сюда
          />
        </div>
        <div className="rounded mt-2 flex flex-wrap items-start gap-1 min-h-[88px] max-h-[88px] overflow-y-auto">
          {keywordsList.length > 0 ? (
            keywordsList.map((word) => (
              <span
                key={word}
                className="inline-flex items-center h-8 bg-blue-100 text-blue-800 text-sm px-2 rounded"
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
            <span className="text-gray-400 text-sm">Ключевые слова не добавлены</span>
          )}
        </div>
      </div>

      {/* Даты */}
      <div className="mb-2 border-b">
        <label className="block text-sm font-medium mb-1">Интервал времени</label>
        <div className="grid grid-cols-1 gap-2">
          <FormField
            name="startDate"
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
        <label className="block text-sm font-medium mb-1">Диапазон цен</label>
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
        <button onClick={onClose} className="w-full px-4 py-2 border rounded text-sm hover:bg-gray-100">Отмена</button>
        <button onClick={handleReset} className="w-full px-4 py-2 border rounded text-sm hover:bg-gray-100">Сбросить</button>
        <button onClick={handleApply} className={`w-full px-4 py-2 text-white rounded 
          ${ isValid() ? "bg-blue-300 hover:bg-blue-700" : "bg-gray-200 hover:bg-gray-200"}`}>
            Применить
        </button>
      </div>
    </div>
  );
};
