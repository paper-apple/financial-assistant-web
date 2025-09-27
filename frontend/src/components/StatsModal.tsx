// // src/components/StatsModal.tsx
// import { useMemo, useState } from "react";
// import { type Expense } from "../types";
// import { groupExpenses, type GroupField } from "../utils/groupExpenses";
// import React from "react";

// type Props = {
//   onClose: () => void;
//   expenses: Expense[];               // сюда передаёшь отображённые карточки (filteredExpenses)
//   initialField?: GroupField;         // необязательный дефолт
//   currency?: string;                 // "BYN" по умолчанию
// };

// const groupFieldLabels: Record<GroupField, string> = {
//   title: "Название",
//   category: "Категория",
//   location: "Место",
// };

// export function StatsModal({
//   onClose,
//   expenses,
//   initialField = "category",
//   currency = "BYN",
// }: Props) {
//   const [field, setField] = useState<GroupField>(initialField);

//   const rows = useMemo(() => groupExpenses(expenses, field), [expenses, field]);

//   const totalCount = useMemo(() => rows.reduce((s, r) => s + r.count, 0), [rows]);
//   const grandTotal = useMemo(() => rows.reduce((s, r) => s + r.total, 0), [rows]);

//   // const percentByTotal = (rows.total / grandTotal) * 100;

//   const money = (n: number) =>
//     new Intl.NumberFormat("ru-RU", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);

//   return (
//     <div className="w-full max-w-sm bg-white rounded-lg">
//       <div className="relative z-10 w-full max-w-sm bg-white rounded-lg">
//         {/* <div className="flex items-center justify-between p-4 border-b">
//           <h2 className="text-lg font-semibold">Статистика по корзине</h2>
//           <button
//             onClick={onClose}
//             className="p-2 rounded hover:bg-gray-100"
//             aria-label="Закрыть"
//           >
//             ✕
//           </button>
//         </div> */}

//         <div className="">
//           {/* Controls */}
//           <div className="mb-4 flex flex-wrap items-center gap-3">
//             <label className="text-sm font-medium">Группировать по:</label>
//             <select
//               value={field}
//               onChange={e => setField(e.target.value as GroupField)}
//               className="border rounded px-3 py-2"
//             >
//               <option value="title">{groupFieldLabels.title}</option>
//               <option value="category">{groupFieldLabels.category}</option>
//               <option value="location">{groupFieldLabels.location}</option>
//             </select>

//             <div className="ml-auto text-sm text-gray-600">
//               Покупок: <span className="font-medium">{totalCount}</span>
//               <span className="mx-2">•</span>
//               Сумма: <span className="font-medium">{money(grandTotal)}</span>
//             </div>
//           </div>

//           {/* Table */}
//           <div className="overflow-auto max-h-[60vh] border rounded">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-50 sticky top-0 z-20">
//                 <tr>
//                   <th className="text-left p-3 border-b w-[65%]">Группа ({groupFieldLabels[field]})</th>
//                   <th className="text-right p-3 border-b w-[15%]">Кол-во</th>
//                   <th className="text-right p-3 border-b w-[20%]">Сумма</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {rows.length === 0 ? (
//                   <tr>
//                     <td colSpan={3} className="p-6 text-center text-gray-500">
//                       Нет данных для выбранных фильтров
//                     </td>
//                   </tr>
//                 ) : (
//                   rows.map(row => {
//                     const percent = grandTotal
//                       ? (row.total / grandTotal) * 100
//                       : 0;

//                     return (
//                       <React.Fragment key={row.key}>
//                         <tr className="relative odd:bg-white even:bg-gray-50 z-10">
//                           <td className="p-3">{row.key}</td>
//                           <td className="p-3 text-right">{row.count}</td>
//                           <td className="p-3 text-right">{money(row.total)}</td>
//                         </tr>
//                         <tr className=" border-b relative">
//                           <td colSpan={3} className="px-3 pb-2">
//                             <div className="flex justify-start w-full bg-gray-200 rounded h-4 ">
//                               <div
//                                 className="bg-blue-500 h-4 rounded"
//                                 style={{ width: `${percent}%` }}
//                               />
//                             </div>  
//                           </td>
//                           <td>
//                             <span className="text-xs text-gray-500">{percent.toFixed(1)}%</span>
//                           </td>
//                         </tr>
//                       </React.Fragment>
//                     );
//                   })
//                 )}
//               </tbody>

//               {/* {rows.length > 0 && (
//                 <tfoot className="bg-gray-50 sticky bottom-0">
//                   <tr>
//                     <td className="p-3 font-medium">Итого</td>
//                     <td className="p-3 text-right font-medium">{totalCount}</td>
//                     <td className="p-3 text-right font-medium">{money(grandTotal)}</td>
//                   </tr>
//                 </tfoot>
//               )} */}
//             </table>
//           </div>
//         </div>

//         <div className="p-4 border-t flex justify-end">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 border rounded hover:bg-gray-100"
//           >
//             Закрыть
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  type ChartData,
  Tooltip,
  Legend
} from "chart.js";
import type { Expense } from "../types";
import { groupExpenses, type GroupField } from "../utils/groupExpenses";
import { StatsChart } from "./StatsChart";
import { StatsTable } from "./StatsTable";
import { Pie } from "react-chartjs-2";
import { buildChartData } from "../utils/buildChartData";
import { TagIcon, RectangleStackIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { RadioGroup } from "./ui/RadioGroup";
import 'simplebar-react/dist/simplebar.min.css';
import SimpleBar from 'simplebar-react';

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  onClose: () => void;
  expenses: Expense[];
  initialField?: GroupField;
};

// const groupFieldLabels: Record<GroupField, string> = {
//   title: "Название",
//   category: "Категория",
//   location: "Место",
// };

const GROUP_OPTIONS: { value: GroupField; label: string; icon: React.ElementType }[] = [
  { value: "title", label: "Название", icon: TagIcon },
  { value: "category", label: "Категория", icon: RectangleStackIcon },
  { value: "location", label: "Место", icon: MapPinIcon },
];

export function StatsModal({
  onClose,
  expenses,
  initialField = "category",
}: Props) {
  const [field, setField] = useState<GroupField>(initialField);
  const [tableMode, setTableMode] = useState(true);

  const rows = useMemo(() => groupExpenses(expenses, field), [expenses, field]);

  const grandTotal = useMemo(() => Math.round(rows.reduce((s, r) => s + r.total, 0) * 100) / 100, [rows]);
  // const grandTotal = useMemo(() => rows.reduce((s, r) => s + r.total, 0), [rows]);
  const totalCount = useMemo(() => rows.reduce((s, r) => s + r.count, 0), [rows]);

  const threshold = 0.02;

  const chartData = useMemo(
    () => buildChartData(rows, grandTotal, threshold),
    [rows, grandTotal]
  );

  return (
    <div className="w-full bg-white rounded-lg">
      <div className="pb-2">

        {/* Controls */}
        <div className="relative mb-2 flex flex-wrap items-center gap-3">
          <label className="text-sm text-center w-full font-medium">Группировать по:</label>
          {/* <select
            value={field}
            onChange={e => setField(e.target.value as GroupField)}
            className="border rounded px-3 py-2"
          >
            <option value="title">{groupFieldLabels.title}</option>
            <option value="category">{groupFieldLabels.category}</option>
            <option value="location">{groupFieldLabels.location}</option>
          </select> */}
          <RadioGroup 
            options={GROUP_OPTIONS} 
            selected={field} 
            onChange={setField} 
            orientation="horizontal"
          />
          {/* <div className="ml-auto text-sm text-gray-600">
            <span className="font-medium">Расходов: {totalCount}</span>
            <span className="font-medium"> | Сумма: {grandTotal}</span>
          </div> */}
        </div>

        {/* Таблица/диаграмма */}
        {/* {rows.length > 0 ? (tableMode ? (
          <StatsTable
            field={field}
            rows={rows}
          />
        ) : (
          <StatsChart
            chartData={chartData}
          />
        )) : (
          <div className="p-6 text-center text-gray-500">
            Нет данных для выбранных фильтров
          </div>
        )} */}
        <div className="h-85"> {/* фиксируем высоту */}
          {rows.length > 0 ? (
            tableMode ? (
              <StatsTable field={field} rows={rows} grandTotal={grandTotal} totalCount={totalCount}/>
            ) : (
              <StatsChart chartData={chartData} />
            )
          ) : (
            <p>Нет данных</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          className="btn-base"
          onClick={() => tableMode ? setTableMode(false) : setTableMode(true)}
        >
          {tableMode ? "Диаграмма" : "Таблица"}
        </button>
        <button
          onClick={onClose}
          className="btn-base btn-cancel"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
