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
      absolute w-full bg-(--bg-secondary) shadow border-x border-b border-(--input-border) rounded-b z-10 overflow-auto
      transition-[max-height] duration-500 
      ${isOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"}
    `}
  >
    {list.map((s, idx) => (
      <li
        key={s}
        onMouseDown={() => onSelect(s)}
        className={`px-1 py-1 text-(--text) border-b border-(--input-border) cursor-pointer transition-colors duration-300 truncate ${
          idx === highlightedIndex ? "bg-(--checked-option)" : "hover:bg-(--checked-option)"
        }`}
      >
        {s}
      </li>
    ))}
  </ul>
);