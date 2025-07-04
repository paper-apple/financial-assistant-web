// // src/pages/ExpensesPage.tsx
// import { useEffect, useState } from "react";
// import { fetchExpenses, type Expense } from "../api";
// import { ExpenseForm } from "../components/ExpenseForm";
// import { ExpenseList } from "../components/ExpenseList";

// export const ExpensesPage = () => {
//   const [expenses, setExpenses] = useState<Expense[]>([]);

//   // загрузка с бэка
//   const load = async () => setExpenses((await fetchExpenses()).data);

//   useEffect(() => { load(); }, []);

//   return (
//     <section className="max-w-md mx-auto">
//       <ExpenseForm onCreated={load} />
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-2">Ваши расходы</h2>
//         <ExpenseList expenses={expenses} />
//       </div>
//     </section>
//   );
// };


// import { useEffect, useState } from "react";
// import { fetchExpenses, type Expense } from "../api";
// import { ExpenseForm } from "../components/ExpenseForm";
// import { ExpenseList } from "../components/ExpenseList";

// export const ExpensesPage = () => {
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [isOpen, setIsOpen] = useState(false);

//   const load = async () => {
//     const res = await fetchExpenses();
//     setExpenses(res.data);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const handleAddComplete = () => {
//     load();
//     setIsOpen(false); // закрыть модалку
//   };

//   return (
//     <section className="relative max-w-md mx-auto px-2">
//       <div className="mt-6">
//         <h2 className="text-xl font-semibold mb-2">Ваши расходы</h2>
//         <ExpenseList expenses={expenses} />
//       </div>

//       {/* Floating Button */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white
//                    font-bold py-3 px-4 rounded-full shadow-lg"
//       >
//         +
//       </button>

//       {/* Modal Window */}
//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-4 w-full max-w-md mx-auto">
//             <h3 className="text-lg font-semibold mb-3 text-center">Добавить расход</h3>
//             <ExpenseForm onCreated={handleAddComplete} />
//             <button
//               onClick={() => setIsOpen(false)}
//               className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-sm py-1 rounded"
//             >
//               Отмена
//             </button>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };


// import { useEffect, useState } from "react";
// import { fetchExpenses, type Expense } from "../api";
// import { ExpenseForm } from "../components/ExpenseForm";
// import { ExpenseList } from "../components/ExpenseList";
// import { Modal } from "../components/Modal";

// export const ExpensesPage = () => {
//   const [expenses, setExpenses] = useState<Expense[]>([]);
//   const [isAddOpen, setAddOpen] = useState(false);  
//   const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

//   const load = async () => {
//     const res = await fetchExpenses();
//     setExpenses(res.data);
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const handleEditClick = (expense: Expense) => {
//     setEditingExpense(expense);
//   };

//   const handleEditComplete = () => {
//     load();
//     setEditingExpense(null);
//   };

//   return (
//     <section className="relative max-w-md mx-auto px-2">
//       {/* список и кнопка добавления */}
//       <ExpenseList
//         expenses={expenses}
//         onEdit={handleEditClick}
//       />

//       {/* модалка редактирования */}
//       {editingExpense && (
//         <Modal
//           isOpen={true}
//           onClose={() => setEditingExpense(null)}
//         >
//           <h3 className="text-lg font-semibold mb-3 text-center">
//             Редактировать расход
//           </h3>
//           <ExpenseForm
//             initialData={editingExpense}
//             onCreated={handleEditComplete}
//           />
//         </Modal>
//       )}
//     </section>
//   );
// };


import { useEffect, useState } from "react";
import { fetchExpenses, type Expense } from "../api";
import { ExpenseForm } from "../components/ExpenseForm";
import { ExpenseList } from "../components/ExpenseList";
import { Modal } from "../components/Modal";

export const ExpensesPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const load = async () => {
    const res = await fetchExpenses();
    setExpenses(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddComplete = () => {
    load();
    setIsOpen(false);
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
  };

  return (
    <section className="relative max-w-md mx-auto px-2">
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Ваши расходы</h2>
        <ExpenseList 
          expenses={expenses} 
          onEdit={handleEditClick} 
        />
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white
                   font-bold py-3 px-4 rounded-full shadow-lg"
      >
        +
      </button>

      {/* Modal для добавления */}
      {isOpen && (
        <Modal isOpen={true} onClose={() => setIsOpen(false)}>
          <h3 className="text-lg font-semibold mb-3 text-center">
            Добавить расход
          </h3>
          <ExpenseForm onCreated={handleAddComplete} />
        </Modal>
      )}

      {/* Modal для редактирования */}
      {editingExpense && (
        <Modal
          isOpen={true}
          onClose={() => setEditingExpense(null)}
        >
          <h3 className="text-lg font-semibold mb-3 text-center">
            Редактировать расход
          </h3>
          <ExpenseForm
            initialData={editingExpense}
            onCreated={() => {
              load();
              setEditingExpense(null);
            }}
          />
        </Modal>
      )}
    </section>
  );
};
