// App.tsx
import { ExpensesPage } from "./components/ExpensesPage";

window.addEventListener('online', () => {
  console.log('Сеть восстановлена');
  window.location.reload();
});

// export function App() {
//   return (
//     <main className="justify-center-safe bg-red-200 p-4">
//       <h1 className="text-2xl font-bold text-center mb-6">Финансовый ассистент</h1>
//       <ExpensesPage />
//     </main>
//   );
// }

// export function App() {
//   return (
//     <main>
//       <div className="max-w-screen-sm mx-auto bg-red-200 p-4">
//         <h1 className="text-2xl font-bold text-center mb-6">Финансовый ассистент</h1>
//         <ExpensesPage />
//       </div>
//     </main>
//   );
// }

export function App() {
  return (
    <main className="flex justify-center min-h-screen bg-gray-100">
      <div  className="max-w-screen-sm w-full bg-blue-100 p-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          Мои финансы
        </h1>
        <ExpensesPage />
      </div>
    </main>
  );
}

export default App;
