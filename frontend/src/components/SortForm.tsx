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
      <div className="pb-2">
        <label className="label-text">Поле для сортировки</label>
        <div className="p-2 rounded-md border border-gray-400">
          <RadioGroup<SortParams['field']>
            options={FIELD_OPTIONS} 
            selected={sortField} 
            onChange={setSortField} 
          />
        </div>
      </div>
      <div className="pb-2">
        <label className="label-text">Направление сортировки</label>
        <div className="p-2 rounded-md border border-gray-400">
          <RadioGroup<SortParams['direction']>
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