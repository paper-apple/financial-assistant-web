// components/FloatingActionButtons.tsx
type Props = {
  onAdd: () => void;
  onFilter: () => void;
  onSort: () => void;
  onStats: () => void;
};

export const FloatingActionButtons = ({ 
  onAdd, 
  onFilter, 
  onSort, 
  onStats 
}: Props) => (
  <>
    <button
      onClick={onAdd}
      className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white
      font-bold py-2 px-3.5 rounded-full z-50"
    >
      +
    </button>
    
    <button
      onClick={onFilter}
      className="fixed bottom-4 right-20 bg-blue-600 hover:bg-blue-700 text-white
      font-bold py-2 px-3.5 rounded-full z-50"
    >
      Фильтры
    </button>
    
    <button
      onClick={onSort}
      className="fixed bottom-4 right-36 bg-blue-600 hover:bg-blue-700 text-white
      font-bold py-2 px-3.5 rounded-full z-50"
    >
      Сортировка
    </button>
    
    <button
      onClick={onStats}
      className="fixed bottom-4 right-52 bg-blue-600 hover:bg-blue-700 text-white
      font-bold py-2 px-3.5 rounded-full z-50"
    >
      Статистика
    </button>
  </>
);