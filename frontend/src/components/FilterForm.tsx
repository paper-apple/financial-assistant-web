import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {type FilterParams} from "../types.tsx"
import { forwardRef } from "react";
import { ru } from "date-fns/locale";


type FilterModalProps = {
  initialValues: FilterParams;
  onApply: (filters: FilterParams) => void;
};

export function FilterForm({ initialValues, onApply }: FilterModalProps) {
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const [endDate, setEndDate] = useState(initialValues.endDate);
  const [dateError, setDateError] = useState(false);
  const [minPrice, setMinPrice] = useState(initialValues.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(initialValues.maxPrice?.toString() ?? "");
  const [priceError, setPriceError] = useState(false);
  const isApplyDisabled = dateError || priceError;

  useEffect(() => {
  const min = parseFloat(minPrice);
  const max = parseFloat(maxPrice);

  if (!isNaN(min) && !isNaN(max)) {
    setPriceError(min > max);
  } else {
    setPriceError(false);
  }
}, [minPrice, maxPrice]);


  const handleApply = () => {
    onApply({
      startDate,
      endDate,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    });
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setDateError(false);
    setMinPrice("");
    setMaxPrice("");
    setPriceError(false);
  };

const handlePriceChange = (value: string, setter: (v: string) => void) => {
  const sanitized = value
    .replace(/[^\d.,]/g, "")
    .replace(",", ".")
    .replace(/^(\d*\.\d{0,2}).*$/, "$1");

  setter(sanitized);
};


  const handleDateBlur = () => {
    if (startDate && endDate) {
      setDateError(startDate > endDate);
    } else {
      setDateError(false); // если одна из дат пуста — не проверяем
    }
  };

  const CustomInput = forwardRef<HTMLInputElement, any>(({ value, onClick, placeholder }, ref) => (
    <input
      type="text"
      readOnly
      onClick={onClick}
      ref={ref}
      value={value}
      placeholder={placeholder}
      className={`w-full border px-3 py-2 rounded ${
        dateError ? "border-red-500 bg-red-50" : "border-gray-300"
      }`}    
      />
    ));

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Фильтры</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Интервал времени</label>
          <div className="flex gap-2">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="От"
              locale={ru}
              showTimeSelect
              dateFormat="dd.MM.yyyy HH:mm"
              customInput={<CustomInput placeholder="Дата и время" />}
              onCalendarClose={handleDateBlur}
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="До"
              locale={ru}
              showTimeSelect
              dateFormat="dd.MM.yyyy HH:mm"
              customInput={<CustomInput placeholder="Дата и время" />}
              onCalendarClose={handleDateBlur}
            />
          </div>
          <div className="min-h-[1.25rem] text-sm text-red-500 mt-1">
            {dateError && "Начальное значение даты больше конечного"}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Диапазон цен</label>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              value={minPrice}
              onChange={(e) => handlePriceChange(e.target.value, setMinPrice)}
              placeholder="Мин"
              // onBlur={handlePriceBlur}
              className={`w-full border px-3 py-2 rounded ${
                priceError ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
            <input
             type="text"
              inputMode="decimal"
              pattern="[0-9]*"
              value={maxPrice}
              onChange={(e) => handlePriceChange(e.target.value, setMaxPrice)}
              placeholder="Макс"
              // onBlur={handlePriceBlur}
              className={`w-full border px-3 py-2 rounded ${
                priceError ? "border-red-500 bg-red-50" : "border-gray-300"
              }`}
            />
          </div>
          <div className="min-h-[1.25rem] text-sm text-red-500 mt-1">
            {priceError && "Минимальное значение стоимости больше конечного"}
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6">
        <button
          onClick={handleReset}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
        >
          Сбросить
        </button>
        <button
          onClick={handleApply}
          aria-disabled={isApplyDisabled}
          disabled={isApplyDisabled}
          className={`w-full py-2 rounded text-white transition ${
            isApplyDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          Применить
        </button>
      </div>
    </div>  
  );
}
