// ErrorBar.tsx
import { TranslationKey, useTranslation } from "../../hooks/useTranslation";


type ErrorBarProps = {
  errorText: TranslationKey;
};

export const ErrorBar: React.FC<ErrorBarProps> = ({
  errorText
}) => {
  const { t } = useTranslation()

  return (
    <div className="absolute bottom-full rounded-md p-1 w-[360px] left-1/2 bg-(--error) transform error-toast">
      <div className="absolute top-full left-1/2 transform -translate-x-1/2">
      </div>
      <div className="whitespace-pre-line text-center text-(--text)">
        {t(errorText)}
      </div>
    </div>
  )
};