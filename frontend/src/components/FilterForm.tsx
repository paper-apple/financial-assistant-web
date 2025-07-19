import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {type FilterParams} from "../types.tsx"

// type FilterModalProps = {
//   initialValues: FilterParams;
//   onApply: (filters: FilterParams) => void;
//   onClose: () => void;
// };

type FilterModalProps = {
  initialValues: FilterParams;
  onApply: (filters: FilterParams) => void;
};

// export function FilterModal({ initialValues, onApply, onClose }: FilterModalProps) {
export function FilterForm({ initialValues, onApply }: FilterModalProps) {
  const [startDate, setStartDate] = useState(initialValues.startDate);
  const [endDate, setEndDate] = useState(initialValues.endDate);
  const [minPrice, setMinPrice] = useState(initialValues.minPrice?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(initialValues.maxPrice?.toString() ?? "");


  // const handleApply = () => {
  //   onApply({
  //     startDate,
  //     endDate,
  //     minPrice: minPrice ? Number(minPrice) : null,
  //     maxPrice: maxPrice ? Number(maxPrice) : null,
  //   });
  //   onClose();
  // };

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
    setMinPrice("");
    setMaxPrice("");
  };

  const handlePriceChange = (value: string, setter: (v: string) => void) => {
    // Разрешаем только цифры и максимум 1 точку
    const sanitized = value.replace(/[^\d.]/g, "").replace(/^(\d*\.\d{0,2}).*$/, "$1");
    setter(sanitized);
  };


  return (
    // <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
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
                className="w-full border rounded px-3 py-2"
                showTimeSelect
                dateFormat="dd.MM.yyyy HH:mm"
              />
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="До"
                className="w-full border rounded px-3 py-2"
                showTimeSelect
                dateFormat="dd.MM.yyyy HH:mm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Диапазон цен</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={minPrice}
                onChange={(e) => handlePriceChange(e.target.value, setMinPrice)}
                placeholder="Мин"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                value={maxPrice}
                onChange={(e) => handlePriceChange(e.target.value, setMaxPrice)}
                placeholder="Макс"
                className="w-full border rounded px-3 py-2"
              />
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
            className="px-4 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Применить
          </button>
        </div>
      </div>  
    // </div>
  );
}
