import { SuggestionsList } from "./SuggestionList";
import type { FormState } from "../../types";
import { useState } from "react";

type FormFieldProps = {
  label?: string;
  name: keyof FormState | 'keyword' | 'startDate' | 'endDate';
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  suggestions?: string[];
  placeholder?: string;
  onSuggestionSelect?: (val: string) => void;
  onKeywordAdd?: () => void;
  readOnly?: boolean;
  onFieldClick?: () => void;
  showCalendarIcon?: boolean; // 👈 новый проп
  onClear?: () => void; // 👈 новый проп
};

// const [isFocused, setIsFocused] = useState(false);

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  suggestions,
  placeholder,
  onSuggestionSelect,
  onKeywordAdd,
  readOnly = false,
  onFieldClick,
  showCalendarIcon = false,
  onClear,
}) => {
  
  const [isFocused, setIsFocused] = useState(false);

  return (
  <div className="relative w-full">
    {/* className={`w-full border rounded px-3 py-2 ${priceError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} */}
    {/* Заголовок и ошибка */}
    {/* <div className="mb-2 pb-2"> */}
      <label className="label-text mb-2">{label}</label>
      {/* {error && <span className="text-sm text-red-500">{error}</span>} */}
    {/* </div> */}

    {/* Поле */}
    {/* <div className="relative w-full"> */}
      <div className="flex items-center border rounded w-full">

        {/* Само поле */}
        <input
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          onClick={readOnly && onFieldClick ? onFieldClick : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`flex-1 min-w-0 px-2 py-1 outline-none ${
            readOnly ? "cursor-pointer" : ""
          } ${ error ? "bg-red-100" : ""}`}
        />

        {/* Кнопка очистки */}
        {!readOnly && onChange && (
          <button
            type="button"
            onClick={() =>
              onChange({
                target: { name, value: "" },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            className="input-delete"
          >
            ×
          </button>
        )}

        {/* <div className="flex items-center border rounded w-full overflow-hidden"> */}
        {/* Кнопка очистки */}
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
    {/* </div> */}

    {/* Подсказки */}
    {isFocused && suggestions && onSuggestionSelect && (
      <SuggestionsList list={suggestions} onSelect={onSuggestionSelect} />
    )}
  </div>
  )
};

        {/* Иконка календаря */}
        {/* {readOnly && showCalendarIcon && (
          <div
            className={`px-2 text-gray-500 hover:text-gray-700 cursor-pointer ${ error ? "bg-red-100" : ""}`}
            onClick={onFieldClick}
          >
            <CalendarDaysIcon className="w-5 h-8" />
          </div>
        )} */}

        {/* Кнопка "+" для keyword */}
        {/* {name === "keyword" && onKeywordAdd && (
          <button
            type="button"
            onClick={onKeywordAdd}
            className="px-3 py-1 text-black hover:text-gray-600 bg-green-200 border-l-1"
          >
            +
          </button>
        )} */}