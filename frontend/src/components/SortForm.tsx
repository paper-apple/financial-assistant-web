// // src/components/SortForm.tsx
// import { useState } from "react";
// import { type SortParams } from "../types";

// type Props = {
//   initialValues: SortParams;
//   onApply:       (sort: SortParams) => void;
//   onClose:       () => void;
// };

// export function SortForm({ initialValues, onApply, onClose }: Props) {
//   const [field, setField] = useState(initialValues.field);
//   const [direction, setDirection] = useState(initialValues.direction);

//   const handleApply = () => {
//     onApply({ field, direction })
//     onClose()
//   };

//   return (
//     <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      
//       {/* Выбор поля */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium mb-1">Выбор поля</label>
//         <div className="flex gap-4">
//           <label className="flex items-center gap-1">
//             <input
//               type="radio"
//               checked={field === "title"}
//               onChange={() => setField("title")}
//             />
//             Название
//           </label>
//           <label className="flex items-center gap-1">
//             <input
//               type="radio"
//               checked={field === "category"}
//               onChange={() => setField("category")}
//             />
//             Категория
//           </label>
//                     <label className="flex items-center gap-1">
//             <input
//               type="radio"
//               checked={field === "price"}
//               onChange={() => setField("price")}
//             />
//             Стоимость
//           </label>
//                     <label className="flex items-center gap-1">
//             <input
//               type="radio"
//               checked={field === "location"}
//               onChange={() => setField("location")}
//             />
//             Место
//           </label>
//                     <label className="flex items-center gap-1">
//             <input
//               type="radio"
//               checked={field === "datetime"}
//               onChange={() => setField("datetime")}
//             />
//             Дата
//           </label>
//         </div>
//       </div>

//       {/* Направление */}
//       <div className="mb-6">
//         <label className="block text-sm font-medium mb-1">Направление</label>
//         <div className="flex gap-4">
//           <label className="flex items-center gap-1">
//             <input
//               type="radio"
//               checked={direction === "ASC"}
//               onChange={() => setDirection("ASC")}
//             />
//             По возрастанию
//           </label>
//           <label className="flex items-center gap-1">
//             <input
//               type="radio"
//               checked={direction === "DESC"}
//               onChange={() => setDirection("DESC")}
//             />
//             По убыванию
//           </label>
//         </div>
//       </div>

//       {/* Кнопки */}
//       <div className="flex justify-end gap-2">
//         <button
//           onClick={onClose}
//           className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
//         >
//           Отмена
//         </button>
//         <button
//           onClick={handleApply}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Применить
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import type { SortParams, SortState } from '../types';

// type SortParams = {
//   field: 'title' | 'category' | 'price' | 'location' | 'datetime';
//   direction: 'ASC' | 'DESC';
// };

type Props = {
  // initialValues: SortParams;
  sortState: SortState;
  applySorts: () => void;
  onClose: () => void;
};

export function SortForm({ sortState, applySorts, onClose }: Props) {
  // const [field, setField] = useState<SortParams['field']>(initialValues.field);
  // const [direction, setDirection] = useState<SortParams['direction']>(initialValues.direction);
  const {
    sortField, setSortField,
    sortDirection, setSortDirection,
  } = sortState;


  const handleApply = () => {
    // onApply({ field, direction });
    applySorts();
    onClose();
  };

  const fieldOptions: { value: SortParams['field']; label: string }[] = [
    { value: 'title', label: 'Название' },
    { value: 'category', label: 'Категория' },
    { value: 'price', label: 'Стоимость' },
    { value: 'location', label: 'Место' },
    { value: 'datetime', label: 'Дата' },
  ];

  const directionOptions: { value: SortParams['direction']; label: string }[] = [
    { value: 'ASC', label: 'По возрастанию' },
    { value: 'DESC', label: 'По убыванию' },
  ];

  const RadioGroup = <T extends string>({
    options,
    selected,
    onChange,
  }: {
    options: { value: T; label: string }[];
    selected: T;
    onChange: (val: T) => void;
  }) => (
    <div className="flex gap-4">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-1">
          <input
            type="radio"
            checked={selected === opt.value}
            onChange={() => onChange(opt.value)}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      {/* Выбор поля */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Выбор поля</label>
        <RadioGroup options={fieldOptions} selected={sortField} onChange={setSortField} />
      </div>

      {/* Направление */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">Направление</label>
        <RadioGroup options={directionOptions} selected={sortDirection} onChange={setSortDirection} />
      </div>

      {/* Кнопки */}
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="px-4 py-2 border rounded text-sm hover:bg-gray-100"
        >
          Отмена
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Применить
        </button>
      </div>
    </div>
  );
}

