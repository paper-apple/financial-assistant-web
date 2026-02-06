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
`;

// const useScrollbarHidden = () => {
//   const [state, setState] = useState({
//     isHidden: false,
//     scrollbarWidth: 0
//   });

//   useEffect(() => {
//     const getScrollbarWidth = () => {
//       const outer = document.createElement('div');
//       outer.style.visibility = 'hidden';
//       outer.style.overflow = 'scroll';
//       document.body.appendChild(outer);
      
//       const inner = document.createElement('div');
//       outer.appendChild(inner);
      
//       const width = outer.offsetWidth - inner.offsetWidth;
//       document.body.removeChild(outer);
      
//       return width;
//     };

//     const checkScrollState = () => {
//       const bodyStyle = window.getComputedStyle(document.body);
//       const isHidden = bodyStyle.overflow === 'hidden' || 
//                        bodyStyle.overflowY === 'hidden';
      
//       setState({
//         isHidden,
//         scrollbarWidth: isHidden ? getScrollbarWidth() : 0
//       });
//     };

//     checkScrollState();

//     // const checkScrollState = () => {
//     //   const bodyStyle = window.getComputedStyle(document.body);
//     //   const isHidden = bodyStyle.overflow === 'hidden'
      
//     //   setState({
//     //     isHidden,
//     //     scrollbarWidth: isHidden ? 16 : 0
//     //   });
//     // };

//     // checkScrollState();

//     // Используем ResizeObserver для отслеживания изменений стилей
//     const observer = new ResizeObserver(checkScrollState);
//     observer.observe(document.body);

//     window.addEventListener('resize', checkScrollState);
//     window.addEventListener('scroll', checkScrollState);

//     return () => {
//       observer.disconnect();
//       window.removeEventListener('resize', checkScrollState);
//       window.removeEventListener('scroll', checkScrollState);
//     };
//   }, []);

//   return state;
// };

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
  // const { isHidden, scrollbarWidth } = useScrollbarHidden();

  return (
    <div className="floating-buttons fixed bottom-0 left-0 right-0 z-40 p-4 px-6 
      max-w-screen-sm mx-auto"
      //  style={{ 
      //   right: isHidden ? `${scrollbarWidth}px` : '0px',
      // }}
      >
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