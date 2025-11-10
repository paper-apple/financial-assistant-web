// export const SuggestionsList = ({
//   list,
//   onSelect,
// }: {
//   list: string[];
//   onSelect: (value: string) => void;
// }) =>
//   list.length > 0 && (
//     <ul className="absolute w-full bg-white border rounded shadow z-10">
//       {list.map((s) => (
//         <li
//           key={s}
//           onMouseDown={() => onSelect(s)}
//           className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
//         >
//           {s}
//         </li>
//       ))}
//     </ul>
//   );


// export const SuggestionsList = ({
//   list,
//   onSelect,
//   highlightedIndex,
// }: {
//   list: string[];
//   onSelect: (value: string) => void;
//   highlightedIndex: number;
// }) => (
//   <ul className="absolute w-full bg-white border rounded shadow z-10">
//     {list.map((s, idx) => (
//       <li
//         key={s}
//         onMouseDown={() => onSelect(s)} // важно: onMouseDown, а не onClick
//         className={`px-3 py-1 cursor-pointer ${
//           idx === highlightedIndex ? "bg-blue-100" : "hover:bg-gray-100"
//         }`}
//       >
//         {s}
//       </li>
//     ))}
//   </ul>
// );


export const SuggestionsList = ({
  list,
  onSelect,
  highlightedIndex,
  isOpen,
}: {
  list: string[];
  onSelect: (value: string) => void;
  highlightedIndex: number;
  isOpen: boolean;
}) => (
  <ul
    className={`
      absolute w-full bg-white shadow border-x border-b rounded-b z-10 overflow-auto
      transition-[max-height] duration-500 
      ${isOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}
    `}
  >
    {list.map((s, idx) => (
      <li
        key={s}
        onMouseDown={() => onSelect(s)}
        className={`px-3 py-1 cursor-pointer ${
          idx === highlightedIndex ? "bg-blue-100" : "hover:bg-gray-100"
        }`}
      >
        {s}
      </li>
    ))}
  </ul>
);



// type Props = {
//   list?: string[];
//   onSelect: (value: string) => void;
//   highlightedIndex: number;
// };

// export const SuggestionsList = ({ list, onSelect, highlightedIndex }: Props) => {
//   if (!list || list.length === 0) return null;

//   return (
//     <ul
//       className={`
//         absolute w-full bg-white border shadow z-10
//         origin-top transition-all duration-200 ease-out
//         ${list.length > 0 ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}
//       `}
//     >
//       {list.map((s, idx) => (
//         <li
//           key={s}
//           onMouseDown={() => onSelect(s)} // важно: onMouseDown, а не onClick
//           className={`px-3 py-1 cursor-pointer ${
//             idx === highlightedIndex ? "bg-blue-100" : "hover:bg-gray-100"
//           }`}
//         >
//           {s}
//         </li>
//       ))}
//     </ul>
//   );
// };


// type Props = {
//   list?: string[];
//   onSelect: (value: string) => void;
//   highlightedIndex: number;
//   isOpen: boolean;
// };

// export const SuggestionsList = ({ list, onSelect, highlightedIndex, isOpen }: Props) => {
//   if (!list || list.length === 0) return null;

//   return (
//     <ul
//       className={`
//         absolute w-full bg-white border shadow z-100 overflow-hidden
//         transition-[max-height,opacity] duration-3000 ease-in-out
//         ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}
//       `}
//     >
//       {list.map((s, idx) => (
//         <li
//           key={s}
//           onMouseDown={() => onSelect(s)}
//           className={`px-3 py-1 cursor-pointer ${
//             idx === highlightedIndex ? "bg-blue-100" : "hover:bg-gray-100"
//           }`}
//         >
//           {s}
//         </li>
//       ))}
//     </ul>
//   );
// };
