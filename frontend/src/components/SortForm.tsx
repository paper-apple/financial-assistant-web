// src/components/SortForm.tsx
import type { SortParams, SortState } from '../types';
import {
  TagIcon,
  RectangleStackIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/solid';

type Props = {
  sortState: SortState;
  // icon: React.ElementType <any>;
  applySorts: () => void;
  onClose: () => void;
};

// Вынесем константы наружу, чтобы не пересоздавались при каждом рендере
const FIELD_OPTIONS: { value: SortParams['field']; label: string; icon: React.ElementType }[] = [
  { value: 'title', label: 'Название', icon: TagIcon },
  { value: 'category', label: 'Категория', icon: RectangleStackIcon },
  { value: 'price', label: 'Стоимость', icon: CurrencyDollarIcon },
  { value: 'location', label: 'Место', icon: MapPinIcon },
  { value: 'datetime', label: 'Дата', icon: CalendarDaysIcon },
];

const DIRECTION_OPTIONS: { value: SortParams['direction']; label: string; icon: React.ElementType }[] = [
  { value: 'ASC', label: 'По возрастанию', icon: ArrowUpIcon },
  { value: 'DESC', label: 'По убыванию', icon: ArrowDownIcon },
];


// Вынесем RadioGroup в отдельный компонент для лучшей читаемости
// const RadioGroup = <T extends string>({
//   options,
//   selected,
//   onChange,
// }: {
//   options: { value: T; label: string }[];
//   selected: T;
//   onChange: (val: T) => void;
// }) => (
//   <div className="gap-2 sm:flex-row sm:gap-4">
//     {options.map(opt => (
//       <label key={opt.value} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
//         <input
//           type="radio"
//           checked={selected === opt.value}
//           onChange={() => onChange(opt.value)}
//           className="text-blue-600 focus:ring-blue-500"
//         />
//         <span className="text-sm">{opt.label}</span>
//       </label>
//     ))}
//   </div>
// );


const RadioGroup = <T extends string>({
  options,
  selected,
  onChange,
}: {
  options: { value: T; label: string; icon: React.ElementType }[];
  // icon: React.ElementType <any>;
  selected: T;
  onChange: (val: T) => void;
}) => (
  <div className="">
    {options.map(opt => {
      const isActive = selected === opt.value;
      const Icon = opt.icon;
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded transition-colors
            ${isActive 
              ? 'bg-blue-100 ' 
              : 'bg-white  hover:bg-gray-50'
            }`}
        >
          <Icon className="w-4 h-4 text-blue-300" />
          {/* <div>{icon}</div> */}
          <span className="text-sm text-gray-800">{opt.label}</span>
        </button>
      );
    })}
  </div>
);

export function SortForm({ sortState, applySorts, onClose }: Props) {
  const { sortField, setSortField, sortDirection, setSortDirection } = sortState;

  const handleApply = () => {
    applySorts();
    onClose();
  };

  return (
    <div className="">
      
      {/* Выбор поля */}
      <div className="mb-2 pb-2 border-b border-gray-700">
        <label className="label-text">Поле для сортировки</label>
        <RadioGroup 
          options={FIELD_OPTIONS} 
          selected={sortField} 
          onChange={setSortField} 
        />
      </div>

      {/* Направление */}
      <div className="mb-4">
        <label className="label-text">Направление сортировки</label>
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
          className="btn-base btn-cancel"
        >
          Отменить
        </button>
        <button
          onClick={handleApply}
          className="btn-base btn-confirm"
        >
          Применить
        </button>
      </div>
    </div>
  );
}