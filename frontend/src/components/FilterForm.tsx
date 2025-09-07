import { forwardRef, useCallback, useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import * as api from '../api';
import { suggestKeywords } from '../api';
import DatePicker from 'react-datepicker';
import type { FilterParams } from '../types';
import { ru } from 'date-fns/locale/ru';

interface FilterFormProps {
  initialValues: FilterParams;
  onApply: (filters: any) => void;
  onClose: () => void;
}

export const FilterForm = ({ initialValues, onApply, onClose }: FilterFormProps) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [keywordsList, setKeywordsList] = useState<string[]>(initialValues.keywords);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(initialValues.startDate)
  const [endDate,   setEndDate]   = useState<Date | null>(initialValues.endDate)
  const [minPrice,  setMinPrice]  = useState(initialValues.minPrice?.toString() ?? "")
  const [maxPrice,  setMaxPrice]  = useState(initialValues.maxPrice?.toString() ?? "")
  const [dateError, setDateError]   = useState(false);
  const [priceError, setPriceError] = useState(false);

  const fetchSuggestions = useCallback(
    debounce(async (value: string) => {
      if (value.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await suggestKeywords(value);
        setSuggestions(res.data);
      } catch (err) {
        console.error(err);
      }
    }, 300),
    []
  );

  useEffect(() => {
    fetchSuggestions(keywordInput);
  }, [keywordInput, fetchSuggestions]);

  const handleAddKeyword = (word: string) => {
    if (!keywordsList.includes(word)) {
      setKeywordsList(prev => [...prev, word]);
    }
    setKeywordInput('');
    setSuggestions([]);
  };

  // Валидация цен
  useEffect(() => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    setPriceError(!isNaN(min) && !isNaN(max) && min > max);
  }, [minPrice, maxPrice]);

  // Валидация дат
  const handleDateBlur = () => {
    if (startDate && endDate) {
      setDateError(startDate > endDate);
    } else {
      setDateError(false);
    }
  };

  // Изменение цен
  const handlePriceChange = (value: string, setter: (v: string) => void) => {
    const sanitized = value
      .replace(/[^\d.,]/g, "")
      .replace(",", ".")
      .replace(/^(\d*\.\d{0,2}).*$/, "$1");

    setter(sanitized);
  };

  // Принятие фильтров
  const handleApply = () => {
    onApply({
      startDate,
      endDate,
      minPrice:  minPrice  ? Number(minPrice) : null,
      maxPrice:  maxPrice  ? Number(maxPrice) : null,
      keywords:  keywordsList,
    })
    onClose()
  }

  // Сброс фильтров
  const handleReset = () => {
    setKeywordInput("")
    setStartDate(null)
    setEndDate(null)
    setMinPrice("")
    setMaxPrice("")
    setKeywordInput("")
    setKeywordsList([]);
  }

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Фильтры</h2>
      <div className="mb-4 relative">
      <label className="block text-sm font-medium mb-1">Ключевые слова</label>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={keywordInput}
          onChange={e => setKeywordInput(e.target.value)}
          placeholder="Введите ключевое слово"
          className="flex-1 border-gray-300 border rounded px-3 py-2"
        />
        <button
          type="button"
          onClick={() => handleAddKeyword(keywordInput)}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Добавить
        </button>
      </div>

      {/* Подсказки */}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border rounded shadow w-full z-10">
          {suggestions.map(s => (
            <li
              key={s}
              onClick={() => handleAddKeyword(s)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {/* Список добавленных */}
      {keywordsList.length > 0 && (
        <div className="bg-gray-50 p-2 rounded mt-2">
          <div className="text-xs text-gray-500 mb-1">Добавленные слова:</div>
          <div className="flex flex-wrap gap-1">
            {keywordsList.map(word => (
              <span
                key={word}
                className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
              >
                {word}
                <button
                  onClick={() => setKeywordsList(prev => prev.filter(k => k !== word))}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>

    {/* Интервал дат */}
       <div className="mb-4">
         <label className="block text-sm font-medium mb-1">
           Интервал времени
        </label>
           <div className="flex gap-2">
          <DatePicker
            selected={startDate}
            onChange={d => setStartDate(d)}
            onCalendarClose={handleDateBlur}
            placeholderText="От"
            locale={ru}
            showTimeSelect
            dateFormat="dd.MM.yyyy HH:mm"
            customInput={
              <CustomInput placeholder="Дата и время" error={dateError} />
            }
          />
          <DatePicker
            selected={endDate}
            onChange={d => setEndDate(d)}
            onCalendarClose={handleDateBlur}
            placeholderText="До"
            locale={ru}
            showTimeSelect
            dateFormat="dd.MM.yyyy HH:mm"
            customInput={
              <CustomInput placeholder="Дата и время" error={dateError} />
            }
          />
        </div>
        {dateError && (
          <div className="text-red-500 text-sm mt-1">
            Начало позже конца
          </div>
        )}
      </div>

      {/* Диапазон цен */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">
          Диапазон цен
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={minPrice}
            onChange={e => handlePriceChange(e.target.value, setMinPrice)}
            placeholder="Мин"
            className={`w-full border rounded px-3 py-2 ${
              priceError ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
          <input
            type="text"
            value={maxPrice}
            onChange={e => handlePriceChange(e.target.value, setMaxPrice)}
            placeholder="Макс"
            className={`w-full border rounded px-3 py-2 ${
              priceError ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
          />
        </div>
        {priceError && (
          <div className="text-red-500 text-sm mt-1">
            Мин больше Макс
          </div>
        )}
      </div>
       {/* Кнопки */}
       <div className="flex justify-end gap-2 mt-6">
<button
          onClick={onClose}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
        >
          Отмена
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
        >
          Сбросить
        </button>

        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Применить
        </button>
      </div>



    </div>
  );
};

// вспомогательный CustomInput для DatePicker
const CustomInput = forwardRef<HTMLInputElement, any>(({ value, onClick, placeholder }, ref) => (
  <input
    type="text"
    readOnly
    onClick={onClick}
    ref={ref}
    value={value}
    placeholder={placeholder}
    className="w-full border px-3 py-2 rounded border-gray-300"
  />
))