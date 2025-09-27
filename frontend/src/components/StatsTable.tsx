import type { ChartData } from "chart.js"
import React from "react";
import type { GroupField, StatRow } from "../utils/groupExpenses";
import 'simplebar-react/dist/simplebar.min.css';
import SimpleBar from 'simplebar-react';

type Props = {
  field: GroupField, 
  rows: StatRow[],
  totalCount: number,
  grandTotal: number
};

const groupFieldLabels: Record<GroupField, string> = {
  title: "Название",
  category: "Категория",
  location: "Место",
};

// const money = (n: number) =>
//   new Intl.NumberFormat("ru-RU", { style: "currency", currency, maximumFractionDigits: 2 }).format(n);

export const StatsTable = ({ field, rows, totalCount, grandTotal }: Props) => 
{          
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
  // <div className="max-h-80 text-sm overflow-y-auto border rounded relative">      
  //   <div className=" bg-gray-300 flex sticky top-0 z-20 border-b">
  //     <th className="bg-amber-200 text-left font-medium p-1 w-[50%]">{groupFieldLabels[field]}</th>
  //     <th className="bg-green-300 text-center font-medium p-1 w-[15%]">Кол-во</th>
  //     <th className="bg-blue-200 text-right font-medium p-1 w-[35%]">Сумма</th>
  //   </div>
  //   <table className="text-sm">
  //     {/* <tbody className="bg-gray-50 sticky top-0 z-20 border-b"> */}
  //       {/* <tr> */}
  //       {/* <div className="w-70 bg-gray-50 sticky top-0 z-20 border-b">
  //         <th className="text-left py-1 pl-2.5 w-[50%]">{groupFieldLabels[field]}</th>
  //         <th className="text-right py-1 w-[15%]">Кол-во</th>
  //         <th className="text-right py-1 pr-2.5 w-[35%]">Сумма</th>
  //       </div> */}
  //       {/* </tr> */}
  //     {/* </tbody> */}
  //     <tbody>
  //       {(
  //         rows.map(row => {
  //           // const percent = grandTotal
  //           //   ? (row.total / grandTotal) * 100
  //           //   : 0;

  //           return (
  //             <React.Fragment key={row.key}>
  //               <tr className="flex odd:bg-white even:bg-gray-50 z-10">
  //                 <td className="bg-amber-200 p-1 w-[50%]">{row.key}</td>
  //                 <td className="bg-green-300 p-1 text-center w-[15%]">{row.count}</td>
  //                 <td className="bg-blue-200 p-1 text-right w-[35%]">{row.total}</td>
  //               </tr>
  //               {/* <tr className=" border-b relative">
  //                 <td colSpan={3} className="px-3 pb-2">
  //                   <div className="flex justify-start w-full bg-gray-200 rounded h-4 ">
  //                     <div
  //                       className="bg-blue-500 h-4 rounded"
  //                       style={{ width: `${percent}%` }}
  //                     />
  //                   </div>  
  //                 </td>
  //                 <td>
  //                   <span className="text-xs text-gray-500">{percent.toFixed(1)}%</span>
  //                 </td>
  //               </tr> */}
  //             </React.Fragment>
  //           );
  //         })
  //       )}
  //     </tbody>
  //       {/* {rows.length > 0 && (
  //         <tfoot className="bg-gray-50 sticky border-t bottom-0 z-200">
  //           <tr>
  //             <td className="p-3 font-medium">Итого</td>
  //             <td className="p-3 text-right font-medium">100</td>
  //             <td className="p-3 text-right font-medium">100</td>
  //           </tr>
  //         </tfoot>
  //       )} */}
  //       {/* <div className="min-w-10 bg-gray-50 border-t sticky bottom-0 flex justify-between px-3 py-2 font-medium z-20">
  //     <span>Итого</span>
  //     <span>100</span>
  //     <span>100</span>
  //   </div> */}
  //     </table>
  //     <div className="bg-gray-400 flex sticky bottom-0 z-20 border-t">
  //       <th className="bg-amber-200 p-1 text-sm text-left font-medium w-[50%]">Итого</th>
  //       <th className="bg-green-300 p-1 text-sm text-center font-medium w-[15%]">{totalCount}</th>
  //       <th className="bg-blue-300 p-1 not-only-of-type:text-sm text-right font-medium w-[35%]">{grandTotal}</th>
  //     </div>
  //   </div>

<div className="border rounded-lg"> 
{/* <div className="border bg-amber-400">   */}
  <div className="flex sticky bottom-0 z-20 border-b">
    {/* <span className="bg-green-300 p-1 text-sm text-left font-medium w-[50%]">{groupFieldLabels[field]}</span>
    <span className="bg-orange-300 p-1 text-sm text-center font-medium w-[17%]">Кол-во</span>
    <span className="bg-red-300 p-1 pr-4.5 text-sm text-right font-medium w-[34%]">Сумма</span> */}
    <span className="first-column">{groupFieldLabels[field]}</span>
    <span className="second-column">Кол-во</span>
    <span className={
      isSafari
        ? "third-column"
        : "third-column mr-3"
    }
      >Сумма</span>
  </div>
  <div className="h-70 overflow-y-auto relative [scrollbar-gutter:stable]">
    <table className="w-full table-fixed border-collapse text-sm">
      <tbody>
        {rows.map(row => (
          <tr key={row.key} className="odd:bg-white even:bg-blue-50">
            {/* <td className="bg-green-300 p-1 w-[53%] truncate">{row.key}</td>
            <td className="bg-orange-300 p-1 text-center w-[18%]">{row.count}</td>
            <td className="bg-red-300 p-1 text-right w-[31.5%]">{row.total}</td> */}
            <td className="p-1 w-[46.5%] truncate">{row.key}</td>
            <td className="p-1 text-center w-[16%]">{row.count}</td>
            <td className="p-1 text-right w-[31.5%]">{row.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
    <div className="flex sticky bottom-0 z-20 border-t">
      <span className="first-column">Итого</span>
      <span className="second-column">{totalCount}</span>
          <span className={
      isSafari
        ? "third-column"
        : "third-column mr-3"
      }
        >{grandTotal}</span>
    </div>
  </div>
  )
}