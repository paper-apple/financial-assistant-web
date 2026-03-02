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
  bg-blue-300/40
  hover:bg-blue-300
  hover:opacity-100
  active:bg-blue-400
  active:opacity-100
  text-white
  font-bold
  py-3.5 
  px-3.5
  rounded-full
  border
  transition-all
  duration-500
  ease-in-out
  pointer-events-auto
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
    const buttons = [
    { onClick: withClose(onLogout), icon: ArrowLeftStartOnRectangleIcon },
    { onClick: withClose(onStats), icon: ChartBarIcon },
    { onClick: withClose(onSort), icon: ArrowsUpDownIcon },
    { onClick: withClose(onFilter), icon: FunnelIcon },
    { onClick: withClose(onAdd), icon: PlusIcon },
  ];

  return (
    <div className="floating-buttons fixed bottom-0 left-1 right-0 z-40 p-4 px-6 
      max-w-screen-sm mx-auto pointer-events-none"
    >
      <div className="max-w-screen-sm mx-auto">
        <div className="flex justify-between">
          {buttons.map(({ onClick, icon: Icon }, idx) => (
            <button key={idx} onClick={onClick} className={btnClass} >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};