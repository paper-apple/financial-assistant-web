// components/FloatingActionButtons.tsx
import { FunnelIcon, AdjustmentsHorizontalIcon, PlusIcon, ChartBarIcon, ArrowLeftStartOnRectangleIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';

type Props = {
  onAdd: () => void;
  onFilter: () => void;
  onSort: () => void;
  onStats: () => void;
  onLogout: () => void;
};

const btnClass =
  "bg-blue-300 hover:bg-blue-500 text-white font-bold py-2 px-3.5 rounded-full";

export const FloatingActionButtons = ({
  onAdd,
  onFilter,
  onSort,
  onStats,
  onLogout,
}: Props) => {
  const buttons = [
    { onClick: onAdd, icon: PlusIcon },
    { onClick: onFilter, icon: FunnelIcon },
    { onClick: onSort, icon: ArrowsUpDownIcon },
    { onClick: onStats, icon: ChartBarIcon },
    { onClick: onLogout, icon: ArrowLeftStartOnRectangleIcon },
  ];

  // return (
  //   <div className="fixed bottom-1 left-0 w-full px-5 z-50">
  //     <div className="flex justify-between">
  //       {buttons.map(({ onClick, icon: Icon }, idx) => (
  //         <button key={idx} onClick={onClick} className={btnClass}>
  //           <Icon className="w-4 h-7" />
  //         </button>
  //       ))}
  //     </div>
  //   </div>
  // );
  return (
    // <div className="fixed bottom-1 left-0 right-0 z-50">
    <div className="fixed bottom-0 left-0 right-0 z-40 p-2 px-5 max-w-screen-sm mx-auto bg-white border-t shadow-md">
      <div className="max-w-screen-sm mx-auto">
        <div className="flex justify-between">
          {buttons.map(({ onClick, icon: Icon }, idx) => (
            <button key={idx} onClick={onClick} className={btnClass}>
              <Icon className="w-7 h-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
