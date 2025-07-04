// // src/components/ExpenseList.tsx
// import { type Expense } from "../api";

// // type Props = { expenses: Expense[] };

// export const ExpenseList = ({ expenses }: { expenses: Expense[] }) => (
//   <ul className="space-y-1">
//     {expenses.map((e) => (
//       <li
//         key={e.id}
//         className="w-full bg-white rounded shadow-sm
//                    flex justify-between items-center
//                    px-2 py-1"
//       >
//         <span className="flex-1 text-sm leading-tight truncate">
//           {e.title}
//         </span>
//         <span className="mx-2 text-sm font-medium">
//           {e.price.toFixed(2)} ₽
//         </span>
//         <span className="text-xs text-gray-400">
//           {new Date(e.datetime).toLocaleTimeString()}
//         </span>
//       </li>
//     ))}
//   </ul>
// );


// import { type Expense } from "../api";

// export const ExpenseList = ({ expenses }: { expenses: Expense[] }) => (
//   <ul className="space-y-2">
//     {expenses.map((e) => (
//       <li
//         key={e.id}
//         className="w-full bg-white rounded-sm shadow-sm p-1 text-xs"
//       >
//         <div className="text-base font-semibold leading-tight">
//           {e.title}
//         </div>
//         <div className="text-xs text-gray-500 leading-tight">
//           {e.category}
//         </div>
//         <div className="text-xs text-gray-700 leading-tight">
//           {e.location}
//         </div>
//         <div className="flex justify-between text-xs text-gray-800 mt-1">
//           <span className="font-medium">{e.price.toFixed(2)} ₽</span>
//           <span className="text-gray-500">{new Date(e.datetime).toLocaleString()}</span>
//         </div>
//       </li>
//     ))}
//   </ul>
// );


import { type Expense } from "../api";

type Props = {
  expenses: Expense[];
  onEdit?: (e: Expense) => void;
};

export const ExpenseList = ({ expenses, onEdit }: Props) => (
  <ul className="space-y-2">
    {expenses.map((e) => (
      <li
        key={e.id}
        onClick={() => onEdit?.(e)}
        className="cursor-pointer p-2 rounded hover:bg-gray-100"
      >
        <div className="text-base font-semibold leading-tight">
          {e.title}
        </div>
        <div className="text-xs text-gray-500 leading-tight">
          {e.category}
        </div>
        <div className="text-xs text-gray-700 leading-tight">
          {e.location}
        </div>
        <div className="flex justify-between text-xs text-gray-800 mt-1">
          <span className="font-medium">{e.price.toFixed(2)} ₽</span>
          <span className="text-gray-500">{new Date(e.datetime).toLocaleString()}</span>
        </div>
      </li>
    ))}
  </ul>
);

