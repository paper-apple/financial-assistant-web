// App.tsx
import { ExpensesPage } from "./pages/ExpensesPage";

window.addEventListener('online', () => {
  console.log('Сеть восстановлена');
  window.location.reload();
});

export function App() {
  return (
    <main className="justify-center-safe bg-red-200 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Финансовый ассистент</h1>
      <ExpensesPage />
    </main>
  );
}

export default App;
