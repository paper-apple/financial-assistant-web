// FloatingActionButtons.tsx
import { FunnelIcon, PlusIcon, ChartBarIcon, ArrowLeftStartOnRectangleIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

type Props = {
  onAdd: () => void;
  onFilter: () => void;
  onSort: () => void;
  onStats: () => void;
  onLogout: () => void;
  closeSelection: () => void;
};

const btnClass =
  "bg-blue-300 hover:bg-blue-500 hover:opacity-100 text-white font-bold py-3.5 px-3.5 rounded-full border-1 transition-colors transition-opacity";

function throttle(fn: () => void, limit: number) {
  let inThrottle = false;
  return () => {
    if (!inThrottle) {
      fn();
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

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
    { onClick: withClose(onAdd), icon: PlusIcon },
    { onClick: withClose(onFilter), icon: FunnelIcon },
    { onClick: withClose(onSort), icon: ArrowsUpDownIcon },
    { onClick: withClose(onStats), icon: ChartBarIcon },
    { onClick: withClose(onLogout), icon: ArrowLeftStartOnRectangleIcon },
  ];

  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const throttledScroll = throttle(() => {
      setIsScrolling(true);
      setTimeout(() => setIsScrolling(false), 150);
    }, 200);

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, []);

  return (
    <div className={`floating-buttons fixed bottom-0 left-0 right-0 z-40 p-2 px-5 
      max-w-screen-sm mx-auto transition-opacity duration-900 ${
      isScrolling  ? "opacity-50" : "opacity-100"
    } 
      `}>
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