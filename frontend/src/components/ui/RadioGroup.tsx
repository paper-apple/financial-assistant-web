// RadioGroup.tsx
import { TranslationKey, useTranslation } from '../../hooks/useTranslation';


export const RadioGroup = <T extends string>({
  heading,
  options,
  selected,
  onChange,
  orientation = "vertical",
  isTranslatable = true,
}: {
  heading: TranslationKey;
  options: { value: T; label: string; icon: React.ElementType }[];
  selected: T;
  onChange: (val: T) => void;
  orientation?: "horizontal" | "vertical";
  isTranslatable?: boolean;
}) => {
  const { t } = useTranslation();
  
  return (
    <div className='w-full bg-(--bg-secondary) rounded-lg pb-2'>
      <label className={`flex pb-1 text-sm text-(--text) w-full ${orientation === "horizontal" ? "justify-center" : ""}`}>
        {t(heading)}
      </label>
    <div className="w-full flex flex-wrap items-center rounded-lg p-2 mb-1 outline outline-(--input-border)">
 
    <div className={`flex w-full ${orientation === "horizontal" ? "gap-2.5" : "flex-col gap-0.5"}`}>    
      {options.map(opt => {
        const isActive = selected === opt.value;
        const Icon = opt.icon;
        const displayText = isTranslatable ? t(opt.label as TranslationKey) : opt.label;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-1 items-center gap-2 px-2 py-2 rounded-md outline outline-(--bg-secondary) transition-colors cursor-pointer
              ${orientation == "horizontal" 
                ? 'justify-center'
                : 'justify-normal'
              }
              ${isActive 
                ? 'bg-(--checked-option) hover:outline-(--modal-border)' 
                : 'hover:outline-(--modal-border)'
              }`}
          >
            <Icon className="w-4 h-4 text-(--main-color)" />
            <span className="text-sm text-(--text)">
              {displayText}
            </span>
          </button>
        );
      })}
    </div>
  </div>
  </div>
  );
};