// FormField.tsx
import { SuggestionsList } from "./SuggestionList";
import type { FormState } from "../../types";
import { useEffect, useState } from "react";
import {
  TagIcon,
  RectangleStackIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/solid';

type FormFieldProps = {
  label?: string;
  name?: keyof FormState;
  value: string;
  testId?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  suggestions?: string[];
  placeholder?: string;
  onSuggestionSelect?: (val: string) => void;
  readOnly?: boolean;
  calendarOpen?: () => void;
  onClear?: () => void;
  type?: string;
  icon?: React.ElementType;
};

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  testId,
  onChange,
  error,
  suggestions,
  placeholder,
  onSuggestionSelect,
  readOnly = false,
  calendarOpen: onFieldClick,
  onClear,
  type = 'text',
  icon,
}) => {
  
  const [isFocused, setIsFocused] = useState(false);

  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0) {
        e.preventDefault();
        onSuggestionSelect?.(suggestions[highlightedIndex]);
        setIsFocused(false);
        setHighlightedIndex(-1);
      }
    }
  };

    useEffect(() => {
      if (readOnly && isFocused && onFieldClick) {
        onFieldClick();
      }
    }, [isFocused]);

  const Icon = icon;

  return (
    <div className="relative w-full">
      <div>
        {label && (
          <div className="flex justify-start items-end gap-1.5 pb-0.5">
            {Icon && <Icon className="flex items-center mb-0.5 w-4 h-4 text-blue-300"/>}
            <label className="label-text">{label}</label>
          </div>
        )}
      </div>
      <div className={`
        div-input transition-all duration-200
        ${error ? 'bg-red-50' : ''}
        ${isFocused ? 'ring-4 ring-blue-50' : ''}
        }
      `}>
        <input
          name={name}
          value={value}
          onChange={onChange}
          data-testid={testId}
          readOnly={readOnly}
          placeholder={placeholder}
          type={type}
          required
          onClick={readOnly && onFieldClick ? onFieldClick : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsFocused(false);
              setHighlightedIndex(-1);
            }, 100);
          }}
          onKeyDown={handleKeyDown}
          className={`flex-1 min-w-0 outline-none text-gray-700
            placeholder:text-sm placeholder:text-gray-400 
            ${readOnly ? "cursor-pointer" : ""} 
          `}
        />

        {onClear && (
          <button
            type="button"
            onClick={onClear}
            className="input-delete"
          >
            ×
          </button>
        )}
      </div>
      <SuggestionsList
        list={suggestions ?? []}
        onSelect={(val) => {
          onSuggestionSelect?.(val);
          setIsFocused(false);
          setHighlightedIndex(-1);
        }}
        highlightedIndex={highlightedIndex}
        isOpen={isFocused && !!suggestions?.length}
      />
    </div>
  )
};