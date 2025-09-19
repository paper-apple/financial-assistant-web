// import type { FormState } from "../../types";
// import { SuggestionsList } from "./SuggestionList";

// export const FormField = ({
//   label,
//   name,
//   value,
//   onChange,
//   // placeholder,
//   error,
//   suggestions,
//   onSuggestionSelect,
//   onKeywordAdd,
// }: {
//   label: string;
//   name: keyof FormState | 'keyword';
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   // placeholder: string;
//   error?: string;
//   suggestions?: string[];
//   onSuggestionSelect?: (val: string) => void;
//   onKeywordAdd?: () => void;
// }) => (
//   <div className="mb-0.5 justify-between relative w-full">
//     <div className="flex justify-between items-center mb-1">
//       <label className="text-sm font-medium">{label}</label>
//       {error && <span className="text-sm text-red-500">{error}</span>}
//     </div>
//     <div className="relative w-full">
//       <div className="flex items-center border rounded w-full overflow-hidden">
//         <button
//           type="button"
//           onClick={() => onChange({ target: { name, value: "" } } as React.ChangeEvent<HTMLInputElement>)}
//           className="px-3 py-1 text-black hover:text-gray-600 bg-red-200 border-r-1"
//         >
//           ×
//         </button>
//         <input
//           name={name}
//           value={value}
//           onChange={onChange}
//           // placeholder={placeholder}
//           className="flex-1 px-3 py-1 outline-none"
//         />
//         {name === 'keyword' && onKeywordAdd && (
//           <button
//             type="button"
//             onClick={onKeywordAdd}
//             className="px-3 py-1 text-black hover:text-gray-600 bg-green-200 border-l-1"
//           >
//             +
//           </button>
//         )}
//       </div>
//     </div>
//     {suggestions && onSuggestionSelect && (
//       <SuggestionsList list={suggestions} onSelect={onSuggestionSelect} />
//     )}
//   </div>
// );


import { CalendarDaysIcon } from "@heroicons/react/24/outline"; 
import { SuggestionsList } from "./SuggestionList";
import type { FormState } from "../../types";
// или любую другую иконку, например из react-icons

type FormFieldProps = {
  label?: string;
  name: keyof FormState | 'keyword' | 'startDate' | 'endDate';
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  suggestions?: string[];
  placeholder: string;
  onSuggestionSelect?: (val: string) => void;
  onKeywordAdd?: () => void;
  readOnly?: boolean;
  onFieldClick?: () => void;
  showCalendarIcon?: boolean; // 👈 новый проп
  onClear?: () => void; // 👈 новый проп
};

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
}) => (
  <div className="mb-0.5 justify-between relative w-full">
    {/* className={`w-full border rounded px-3 py-2 ${priceError ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} */}
    {/* Заголовок и ошибка */}
    <div className="flex justify-between items-center mb-1">
      <label className="text-sm font-medium">{label}</label>
      {/* {error && <span className="text-sm text-red-500">{error}</span>} */}
    </div>

    {/* Поле */}
    <div className="relative w-full">
      <div className="flex items-center border rounded w-full overflow-hidden">
        {/* Кнопка очистки */}
        {!readOnly && onChange && (
          <button
            type="button"
            onClick={() =>
              onChange({
                target: { name, value: "" },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            className={`px-3 py-1 text-black hover:text-gray-600 border-r bg-red-200`}
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
            className="px-3 py-1 text-black hover:text-gray-600 bg-red-200 border-r-1"
          >
            ×
          </button>
        )}

        {/* Само поле */}
        <input
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder}
          onClick={readOnly && onFieldClick ? onFieldClick : undefined}
          className={`flex-1 px-2 py-1 outline-none ${
            readOnly ? "cursor-pointer" : ""
          } ${ error ? "bg-red-100" : ""}`}
        />

        {/* Иконка календаря */}
        {readOnly && showCalendarIcon && (
          <div
            className={`px-2 text-gray-500 hover:text-gray-700 cursor-pointer ${ error ? "bg-red-100" : ""}`}
            onClick={onFieldClick}
          >
            <CalendarDaysIcon className="w-5 h-8" />
          </div>
        )}

        {/* Кнопка "+" для keyword */}
        {name === "keyword" && onKeywordAdd && (
          <button
            type="button"
            onClick={onKeywordAdd}
            className="px-3 py-1 text-black hover:text-gray-600 bg-green-200 border-l-1"
          >
            +
          </button>
        )}
      </div>
    </div>

    {/* Подсказки */}
    {suggestions && onSuggestionSelect && (
      <SuggestionsList list={suggestions} onSelect={onSuggestionSelect} />
    )}
  </div>
);
