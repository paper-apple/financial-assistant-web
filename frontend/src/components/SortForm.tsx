// SortForm.tsx
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
import { RadioGroup } from './ui/RadioGroup';

type Props = {
  sortState: SortState;
  applySorts: () => void;
  onClose: () => void;
};

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

export function SortForm({ sortState, applySorts, onClose }: Props) {
  const { sortField, setSortField, sortDirection, setSortDirection } = sortState;

  const handleApply = () => {
    applySorts();
    onClose();
  };

  return (
    <div>
      <div className="mb-2 pb-2 border-b border-gray-700">
        <label className="label-text">Поле для сортировки</label>
        <div className="pt-2">
          <RadioGroup 
            options={FIELD_OPTIONS} 
            selected={sortField} 
            onChange={setSortField} 
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="label-text">Направление сортировки</label>
        <div className="pt-2">
          <RadioGroup 
            options={DIRECTION_OPTIONS} 
            selected={sortDirection} 
            onChange={setSortDirection} 
          />
        </div>
      </div>
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