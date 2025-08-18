import { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { ru } from 'date-fns/locale/ru';
import { type FilterParams } from '../types.tsx';

type Props = {
  initialValues: FilterParams
  onApply: (filters: FilterParams) => void
  onClose: () => void
}

export function FilterForm({ initialValues, onApply, onClose }: Props) {
  // Поля формы
  const [startDate, setStartDate] = useState<Date | null>(initialValues.startDate)
  const [endDate,   setEndDate]   = useState<Date | null>(initialValues.endDate)
  const [minPrice,  setMinPrice]  = useState(initialValues.minPrice?.toString() ?? "")
  const [maxPrice,  setMaxPrice]  = useState(initialValues.maxPrice?.toString() ?? "")

  const [dateError, setDateError]   = useState(false);
  const [priceError, setPriceError] = useState(false);
  // Текущее вводимое слово
  const [keywordInput, setKeywordInput] = useState("");

  // Список добавленных ключевых слов
  const [keywordsList, setKeywords] = useState<string[]>(initialValues.keywords);


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
    setKeywords([]);
  }

  const handleKeywordDelete = (wordToDelete: string) => {
    setKeywords(prev => prev.filter(word => word !== wordToDelete));
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Фильтры</h2>

      {/* Ключевое слово */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Ключевое слово</label>
        <input
          type="text"
          value={keywordInput}
          onChange={e => setKeywordInput(e.target.value)}
          placeholder="Введите ключевое слово"
          className="w-full border-gray-300 border rounded px-3 py-2"
        />
        <button
          className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
          onClick={() => {
            const term = keywordInput.trim().toLowerCase();
            if (term && !keywordsList.includes(term)) {
              setKeywords(prev => [...prev, term]);
            }
            setKeywordInput("");
          }}
        >
          Добавить ключевое слово
        </button>

        {/* Список ключевых слов */}
        <ul>
        {keywordsList.map((word) => (
          <li key={word}>
            {word}
            <button onClick={() => handleKeywordDelete(word)} style={{ marginRight: "8px" }}>
              ✖
            </button>
          </li>
        ))}
        </ul>
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
  )
}

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

