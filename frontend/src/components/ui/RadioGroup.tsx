// RadioGroup.tsx
export const RadioGroup = <T extends string>({
  options,
  selected,
  onChange,
  orientation = "vertical",
}: {
  options: { value: T; label: string; icon: React.ElementType }[];
  selected: T;
  onChange: (val: T) => void;
  orientation?: "horizontal" | "vertical";
}) => (
<div className={`flex w-full ${orientation === "horizontal" ? "gap-4.5" : "flex-col"}`}>    {options.map(opt => {
      const isActive = selected === opt.value;
      const Icon = opt.icon;
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex flex-1 items-center  gap-2 px-2 py-2 rounded-md transition-colors cursor-pointer
            ${orientation == "horizontal" 
              ? 'justify-center'
              : 'justify-normal'
            }
            ${isActive 
              ? 'bg-blue-100 ' 
              : 'bg-white  hover:bg-gray-50'
            }`}
        >
          <Icon className="w-4 h-4 text-blue-300" />
          <span className="text-sm text-gray-800">{opt.label}</span>
        </button>
      );
    })}
  </div>
);