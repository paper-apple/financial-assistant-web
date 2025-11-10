// SuggestionList.tsx
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