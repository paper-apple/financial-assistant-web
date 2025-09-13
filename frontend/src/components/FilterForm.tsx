import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import type { FiltersState } from '../types';
import { ru } from 'date-fns/locale/ru';
import { handlePriceChange } from '../utils/sanitizePrice';
import React from 'react';


// ===== Типы пропсов =====
interface FilterFormProps {
  suggestions: string[];
  filtersState: FiltersState;
  handleAddKeyword: (word: string) => void;
  applyFilters: () => void;
  handleReset: () => void;
  onClose: () => void;
}

// ===== Основной компонент =====
export const FilterForm: React.FC<FilterFormProps> = ({
  suggestions,
  filtersState,
  applyFilters,
  handleAddKeyword,
  handleReset,
  onClose
}) => {
  const {
    keywordInput, setKeywordInput,
    keywordsList, setKeywordsList,
    startDate, setStartDate,
    endDate, setEndDate,
    minPrice, setMinPrice,
    maxPrice, setMaxPrice,
    dateError,
    priceError,
  } = filtersState;

  const handleApply = () => {
    applyFilters();
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Фильтры</h2>

      <KeywordInput
        value={keywordInput}
        onChange={setKeywordInput}
        onAdd={handleAddKeyword}
        suggestions={suggestions}
      />

      <KeywordList
        keywords={keywordsList}
        onRemove={word => setKeywordsList(prev => prev.filter(k => k !== word))}
      />

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        onStartChange={setStartDate}
        onEndChange={setEndDate}
        error={dateError}
      />

      <PriceRange
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinChange={v => handlePriceChange(v, setMinPrice)}
        onMaxChange={v => handlePriceChange(v, setMaxPrice)}
        error={priceError}
      />

      <div className="flex justify-end gap-2 mt-6">
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleReset}>Сбросить</Button>
        <Button primary onClick={handleApply}>Применить</Button>
      </div>
    </div>
  );
};


interface KeywordInputProps {
  value: string;
  onChange: (val: string) => void;
  onAdd: (word: string) => void;
  suggestions: string[];
}

const KeywordInput: React.FC<KeywordInputProps> = ({ value, onChange, onAdd, suggestions }) => (
  <div className="mb-4 relative">
    <label className="block text-sm font-medium mb-1">Ключевые слова</label>
    <div className="flex gap-2 mb-2">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Введите ключевое слово"
        className="flex-1 border-gray-300 border rounded px-3 py-2"
      />
      <button
        type="button"
        onClick={() => onAdd(value)}
        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Добавить
      </button>
    </div>
    {suggestions.length > 0 && (
      <ul className="absolute bg-white border rounded shadow w-full z-10">
        {suggestions.map(s => (
          <li
            key={s}
            onClick={() => onAdd(s)}
            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {s}
          </li>
        ))}
      </ul>
    )}
  </div>
);

interface KeywordListProps {
  keywords: string[];
  onRemove: (word: string) => void;
}

const KeywordList: React.FC<KeywordListProps> = ({ keywords, onRemove }) =>
  keywords.length > 0 && (
    <div className="bg-gray-50 p-2 rounded mt-2">
      <div className="text-xs text-gray-500 mb-1">Добавленные слова:</div>
      <div className="flex flex-wrap gap-1">
        {keywords.map(word => (
          <span
            key={word}
            className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
          >
            {word}
            <button
              onClick={() => onRemove(word)}
              className="ml-1 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartChange: (date: Date | null) => void;
  onEndChange: (date: Date | null) => void;
  error: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  error
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">Интервал времени</label>
    <div className="flex gap-2">
      <DatePicker
        selected={startDate}
        onChange={onStartChange}
        placeholderText="От"
        locale={ru}
        showTimeSelect
        dateFormat="dd.MM.yyyy HH:mm"
        customInput={<CustomInput placeholder="Дата и время" error={error} />}
      />
      <DatePicker
        selected={endDate}
        onChange={onEndChange}
        placeholderText="До"
        locale={ru}
        showTimeSelect
        dateFormat="dd.MM.yyyy HH:mm"
        customInput={<CustomInput placeholder="Дата и время" error={error} />}
      />
    </div>
    {error && <div className="text-red-500 text-sm mt-1">Начальная дата позже конечной</div>}
  </div>
);

interface PriceRangeProps {
  minPrice: string;
  maxPrice: string;
  onMinChange: (val: string) => void;
  onMaxChange: (val: string) => void;
  error: boolean;
}

const PriceRange: React.FC<PriceRangeProps> = ({
  minPrice,
  maxPrice,
  onMinChange,
  onMaxChange,
  error
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium mb-1">Диапазон цен</label>
    <div className="flex gap-2">
      <input
        type="text"
        value={minPrice}
        onChange={e => onMinChange(e.target.value)}
        placeholder="Мин"
        className={`w-full border rounded px-3 py-2 ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
      />
      <input
        type="text"
        value={maxPrice}
        onChange={e => onMaxChange(e.target.value)}
        placeholder="Макс"
        className={`w-full border rounded px-3 py-2 ${error ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
      />
    </div>
    {error && <div className="text-red-500 text-sm mt-1">Мин больше Макс</div>}
  </div>
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  primary?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, primary, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded text-sm ${
      primary
        ? 'bg-blue-600 text-white hover:bg-blue-700'
        : 'border hover:bg-gray-100'
    }`}
  >
    {children}
  </button>
);

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  placeholder?: string;
  error?: boolean;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ value, onClick, placeholder }, ref) => (
    <input
      type="text"
      readOnly
      onClick={onClick}
      ref={ref}
      value={value}
      placeholder={placeholder}
      className="w-full border px-3 py-2 rounded border-gray-300"
    />
  )
);

