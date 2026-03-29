// FloatingActionButtons.tsx
import { 
  FunnelIcon, 
  PlusIcon, 
  ChartBarIcon,
  ArrowsUpDownIcon, 
  ChevronDoubleUpIcon,
  Cog6ToothIcon } from '@heroicons/react/24/outline';
import { isSafari } from '../../utils/isSafari';
import { useScrollbar } from '../../hooks/useScrollbar';
import { useEffect, useState } from 'react';

type Props = {
  onAdd: () => void;
  onFilter: () => void;
  onSort: () => void;
  onStats: () => void;
  onSettings: () => void;
  closeSelection: () => void;
};

const btnClass = `
  font-bold
  py-3.5 
  px-3.5
  transition-all
  duration-500
  ease-in-out
  pointer-events-auto
`;

const btnRow = `
  floating-buttons 
  fixed 
  left-1 
  right-1 
  z-40 
  p-4 
  px-6 
  max-w-screen-sm 
  mx-auto 
  pointer-events-none
`;

const iconCls = `w-4 h-4 opacity-80`

export const FloatingActionButtons = ({
  onAdd,
  onFilter,
  onSort,
  onStats,
  onSettings,
  closeSelection,
}: Props) => {
  const withClose = (fn: () => void) => () => {
    closeSelection();
    fn();
  };
    const roundButtons = [
    { onClick: withClose(onSettings), icon: Cog6ToothIcon },
    { onClick: withClose(onStats), icon: ChartBarIcon },
    { onClick: withClose(onSort), icon: ArrowsUpDownIcon },
    { onClick: withClose(onFilter), icon: FunnelIcon },
    { onClick: withClose(onAdd), icon: PlusIcon },
  ];

  const { hasScrollbar, scrollbarWidth } = useScrollbar();
  const [showScroll, setShowScroll] = useState(false);

    useEffect(() => {
    const toggleVisible = () => setShowScroll(window.scrollY > 300);
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const Icon: React.ElementType = ChevronDoubleUpIcon;
  
  return (
    <div>
      {showScroll && (
        <div
          className={`${btnRow} flex justify-end bottom-20 fade-in-up`}
          style={{
            right: !isSafari && hasScrollbar ? `${scrollbarWidth - 5}px` : ''
          }}
        >
          <div className="max-w-screen-sm">
            <button onClick={scrollToTop} className={`${btnClass} rounded-xl border border-(--main-color) text-(--main-color) hover:text-white hover:bg-(--main-color)`}>
              <Icon className={`${iconCls}`}/>
            </button>
          </div>
        </div>
      )}
      <div
        className={`${btnRow} bottom-0`}
        style={{
          right: !isSafari && hasScrollbar ? `${scrollbarWidth - 5}px` : ''
        }}
      >
        <div className="max-w-screen-sm mx-auto">
          <div className="flex justify-between">
            {roundButtons.map(({ onClick, icon: Icon }, idx) => (
              <button key={idx} onClick={onClick} className={`${btnClass} text-(--btn-floating-text) bg-(--main-color)/40 hover:bg-(--main-hover-color) rounded-full`}>
                <Icon className={`${iconCls}`}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};