// src/components/SortForm.tsx
import type { SortParams, SortState } from '../types';

type Props = {
  sortState: SortState;
  applySorts: () => void;
  onClose: () => void;
};

// Вынесем константы наружу, чтобы не пересоздавались при каждом рендере
const FIELD_OPTIONS: { value: SortParams['field']; label: string }[] = [
  { value: 'title', label: 'Название' },
  { value: 'category', label: 'Категория' },
  { value: 'price', label: 'Стоимость' },
  { value: 'location', label: 'Место' },
  { value: 'datetime', label: 'Дата' },
];

const DIRECTION_OPTIONS: { value: SortParams['direction']; label: string }[] = [
  { value: 'ASC', label: 'По возрастанию' },
  { value: 'DESC', label: 'По убыванию' },
];

// Вынесем RadioGroup в отдельный компонент для лучшей читаемости
const RadioGroup = <T extends string>({
  options,
  selected,
  onChange,
}: {
  options: { value: T; label: string }[];
  selected: T;
  onChange: (val: T) => void;
}) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
    {options.map(opt => (
      <label key={opt.value} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
        <input
          type="radio"
          checked={selected === opt.value}
          onChange={() => onChange(opt.value)}
          className="text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm">{opt.label}</span>
      </label>
    ))}
  </div>
);

export function SortForm({ sortState, applySorts, onClose }: Props) {
  const { sortField, setSortField, sortDirection, setSortDirection } = sortState;

  const handleApply = () => {
    applySorts();
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
      <h2 className="text-lg font-semibold mb-6">Сортировка</h2>
      
      {/* Выбор поля */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3 text-gray-700">Поле для сортировки</label>
        <RadioGroup 
          options={FIELD_OPTIONS} 
          selected={sortField} 
          onChange={setSortField} 
        />
      </div>

      {/* Направление */}
      <div className="mb-8">
        <label className="block text-sm font-medium mb-3 text-gray-700">Направление сортировки</label>
        <RadioGroup 
          options={DIRECTION_OPTIONS} 
          selected={sortDirection} 
          onChange={setSortDirection} 
        />
      </div>

      {/* Кнопки */}
      {/* <div className="flex justify-end gap-3 pt-4 border-t border-gray-200"> */}
        <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Отмена
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Применить
        </button>
      </div>
    </div>
  );
}