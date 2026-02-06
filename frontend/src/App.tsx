// App.tsx
import { ExpensesPage } from "./components/ExpensesPage";

window.addEventListener('online', () => {
  console.log('Сеть восстановлена');
  window.location.reload();
});

export function App() {
  return (
    <main className="relative flex justify-center min-h-screen bg-gradient-to-b from-blue-50 to-blue-200 animate-gradient-x bg-fixed">
      <div  className="relative max-w-screen-sm w-full p-4 m-2 rounded-2xl bg-white/60">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-6 drop-shadow-md">
          Web-помощник
        </h1>
        <ExpensesPage />
      </div>
    </main>
  );
}

export default App;