// SortForm.tsx
import type { SortParams, SortState } from '../../types';
import {
  TagIcon,
  RectangleStackIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/solid';
import { RadioGroup } from '../ui/RadioGroup';
import { TranslationKey, useTranslation } from '../../hooks/useTranslation';

type Props = {
  sortState: SortState;
  applySorts: () => void;
  onClose: () => void;
};

const FIELD_OPTIONS: { value: SortParams['field']; label: TranslationKey; icon: React.ElementType }[] = [
  { value: 'title', label: 'title', icon: TagIcon },
  { value: 'category', label: 'category', icon: RectangleStackIcon },
  { value: 'price', label: 'cost', icon: CurrencyDollarIcon },
  { value: 'location', label: 'place', icon: MapPinIcon },
  { value: 'datetime', label: 'date', icon: CalendarDaysIcon },
];

const DIRECTION_OPTIONS: { value: SortParams['direction']; label: TranslationKey; icon: React.ElementType }[] = [
  { value: 'ASC', label: 'ascending_order', icon: ArrowUpIcon },
  { value: 'DESC', label: 'descending_order', icon: ArrowDownIcon },
];

export function SortForm({ sortState, applySorts, onClose }: Props) {
  const { sortField, setSortField, sortDirection, setSortDirection } = sortState;

  const handleApply = () => {
    applySorts();
    onClose();
  };

  const { t } = useTranslation()

  return (
    <div>
      <RadioGroup<SortParams['field']>
        heading='sorting_field'
        options={FIELD_OPTIONS} 
        selected={sortField} 
        onChange={setSortField} 
      />
      <RadioGroup<SortParams['direction']>
        heading='sorting_direction'
        options={DIRECTION_OPTIONS} 
        selected={sortDirection} 
        onChange={setSortDirection} 
      />
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="btn-base btn-cancel"
        >
          {t('cancel')}
        </button>
        <button
          onClick={handleApply}
          className="btn-base btn-confirm"
        >
          {t('apply')}
        </button>
      </div>
    </div>
  );
}