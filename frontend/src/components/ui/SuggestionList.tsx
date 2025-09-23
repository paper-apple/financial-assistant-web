export const SuggestionsList = ({
  list,
  onSelect,
}: {
  list: string[];
  onSelect: (value: string) => void;
}) =>
  list.length > 0 && (
    <ul className="absolute w-full bg-white border rounded shadow z-10">
      {list.map((s) => (
        <li
          key={s}
          onClick={() => onSelect(s)}
          className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
        >
          {s}
        </li>
      ))}
    </ul>
  );