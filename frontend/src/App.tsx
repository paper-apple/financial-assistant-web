// App.tsx
import { ExpensesPage } from "./components/ExpensesPage";

window.addEventListener('online', () => {
  console.log('Сеть восстановлена');
  window.location.reload();
});

export function App() {
  return (
    <main className="relative flex justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 animate-gradient-x bg-fixed">
      <div  className="main relative max-w-screen-sm w-full p-4 m-2 rounded-2xl bg-white/60">
        <h1 className="text-xl font-normal text-center text-gray-700 mb-4 drop-shadow-md">
            ФИНАНСОВЫЙ АССИСТЕНТ
        </h1>
        <ExpensesPage />
      </div>
    </main>
  );
}

export default App;