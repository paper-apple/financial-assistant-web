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


export const SuggestionsList = ({
  list,
  onSelect,
  highlightedIndex,
}: {
  list: string[];
  onSelect: (value: string) => void;
  highlightedIndex: number;
}) => (
  <ul className="absolute w-full bg-white border rounded shadow z-10">
    {list.map((s, idx) => (
      <li
        key={s}
        onMouseDown={() => onSelect(s)} // важно: onMouseDown, а не onClick
        className={`px-3 py-1 cursor-pointer ${
          idx === highlightedIndex ? "bg-blue-100" : "hover:bg-gray-100"
        }`}
      >
        {s}
      </li>
    ))}
  </ul>
);
