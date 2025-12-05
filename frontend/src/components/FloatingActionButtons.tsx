// FloatingActionButtons.tsx
import { FunnelIcon, PlusIcon, ChartBarIcon, ArrowLeftStartOnRectangleIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

type Props = {
  onAdd: () => void;
  onFilter: () => void;
  onSort: () => void;
  onStats: () => void;
  onLogout: () => void;
  closeSelection: () => void;
};

const btnClass = `
  bg-blue-300/40           /* изначально полупрозрачная */
  hover:bg-blue-300        /* при наведении - более насыщенный цвет */
  hover:opacity-100        /* при наведении - полностью непрозрачная */
  active:bg-blue-400       /* при удержании - самый насыщенный синий */
  active:opacity-100       /* при удержании - полностью непрозрачная */
  text-white 
  font-bold 
  py-3.5 
  px-3.5 
  rounded-full 
  border 
  transition-all           /* анимируем все свойства */
  duration-500             /* продолжительность анимации */
  ease-in-out              /* плавное ускорение и замедление */
`;


export const FloatingActionButtons = ({
  onAdd,
  onFilter,
  onSort,
  onStats,
  onLogout,
  closeSelection,
}: Props) => {
  const withClose = (fn: () => void) => () => {
    closeSelection();
    fn();
  };
  
  // const buttons = [
  //   { onClick: withClose(onAdd), icon: PlusIcon },
  //   { onClick: withClose(onFilter), icon: FunnelIcon },
  //   { onClick: withClose(onSort), icon: ArrowsUpDownIcon },
  //   { onClick: withClose(onStats), icon: ChartBarIcon },
  //   { onClick: withClose(onLogout), icon: ArrowLeftStartOnRectangleIcon },
  // ];

    const buttons = [
    { onClick: withClose(onLogout), icon: ArrowLeftStartOnRectangleIcon },
    { onClick: withClose(onStats), icon: ChartBarIcon },
    { onClick: withClose(onSort), icon: ArrowsUpDownIcon },
    { onClick: withClose(onFilter), icon: FunnelIcon },
    { onClick: withClose(onAdd), icon: PlusIcon },
  ];

  return (
    <div className="floating-buttons fixed bottom-0 left-0 right-0 z-40 p-2 px-5 
      max-w-screen-sm mx-auto">
      <div className="max-w-screen-sm mx-auto">
        <div className="flex justify-between">
          {buttons.map(({ onClick, icon: Icon }, idx) => (
            <button key={idx} onClick={onClick} className={btnClass}>
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};