// FormField.tsx
import { SuggestionsList } from "./SuggestionList";
import type { FormState } from "../../types";
import { useState } from "react";

type FormFieldProps = {
  label?: string;
  name: keyof FormState | 'keyword' | 'startDate' | 'endDate';
  value: string;
  testId?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  suggestions?: string[];
  placeholder?: string;
  onSuggestionSelect?: (val: string) => void;
  readOnly?: boolean;
  onFieldClick?: () => void;
  showCalendarIcon?: boolean;
  onClear?: () => void;
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
  onFieldClick,
  showCalendarIcon = false,
  onClear,
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

  return (
    <div className="relative w-full">
        <label className="text-left text-sm text-gray-500 mb-2">{label}</label>
        <div className="flex items-center border-b border-neutral-500 bg-white w-full">
          <input
            name={name}
            value={value}
            onChange={onChange}
            data-testid={testId}
            readOnly={readOnly}
            placeholder={placeholder}
            onClick={readOnly && onFieldClick ? onFieldClick : undefined}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsFocused(false);
                setHighlightedIndex(-1);
              }, 100);
            }}
            onKeyDown={handleKeyDown}
            className={`flex-1 min-w-0 py-1 outline-none ${
              readOnly ? "cursor-pointer" : ""
            } ${ error ? "bg-red-100" : ""}`}
          />

          {onClear && showCalendarIcon && (
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