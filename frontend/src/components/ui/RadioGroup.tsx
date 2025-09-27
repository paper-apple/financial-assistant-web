export const RadioGroup = <T extends string>({
  options,
  selected,
  onChange,
  orientation = "vertical",
}: {
  options: { value: T; label: string; icon: React.ElementType }[];
  // icon: React.ElementType <any>;
  selected: T;
  onChange: (val: T) => void;
  orientation?: "horizontal" | "vertical";
}) => (
  <div className={orientation === "horizontal" ? "flex gap-3.5" : "space-y-1"}>    
    {options.map(opt => {
      const isActive = selected === opt.value;
      const Icon = opt.icon;
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded transition-colors
            ${isActive 
              ? 'bg-blue-100 ' 
              : 'bg-white  hover:bg-gray-50'
            }`}
        >
          <Icon className="w-4 h-4 text-blue-300" />
          {/* <div>{icon}</div> */}
          <span className="text-sm text-gray-800">{opt.label}</span>
        </button>
      );
    })}
  </div>
);