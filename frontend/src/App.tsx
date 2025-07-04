// App.tsx
import { ExpensesPage } from "./pages/ExpensesPage";

export function App() {
  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Финансовый ассистент</h1>
      <ExpensesPage />
    </main>
  );
}

export default App;
