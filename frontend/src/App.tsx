// App.tsx
import { ExpensesPage } from "./components/modules/ExpensesPage";
import { SettingsProvider } from "./context/SettingsContext";

window.addEventListener('online', () => {
  console.log('Сеть восстановлена');
  window.location.reload();
});

export function App() {
  return (
    <SettingsProvider>
      <main className="relative flex justify-center min-h-screen bg-linear-to-b from-(--bg-from) to-(--bg-to) animate-gradient-x bg-fixed">
        <div className="main relative max-w-screen-sm w-full p-4 m-2 rounded-2xl bg-(--bg-secondary)/60">
          <ExpensesPage />
        </div>
      </main>
    </SettingsProvider>
  );
}

export default App;