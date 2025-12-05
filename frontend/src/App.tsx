// App.tsx
import { ExpensesPage } from "./components/ExpensesPage";

window.addEventListener('online', () => {
  console.log('Сеть восстановлена');
  window.location.reload();
});

export function App() {
  return (
    <main className="flex justify-center min-h-screen ">
      <div  className="max-w-screen-sm w-full bg-blue-100 p-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          Web-помощник
        </h1>
        <ExpensesPage />
      </div>
    </main>
  );
}

export default App;