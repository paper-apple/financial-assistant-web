// SettingsModal.tsx
import { Language, Theme, useSettings } from '../../context/SettingsContext';
import { TranslationKey, useTranslation } from '../../hooks/useTranslation';
import { RadioGroup } from '../ui/RadioGroup';
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";


type Props = {
  onClose: () => void;
  logout: () => void;
};

export const SettingsModal = ({ onClose, logout }: Props) => {
  const { theme, language, setTheme, setLanguage } = useSettings();

  const RuFlag = () => (
    <img src="ru.png" alt="RU" className="w-4 h-4" />
  );

  const UkFlag = () => (
    <img src="uk.png" alt="RU" className="w-4 h-4" />
  );

  const GROUP_THEME_OPTIONS: { value: Theme; label: TranslationKey; icon: React.ElementType }[] = [
    { value: "light", label: "light", icon: SunIcon },
    { value: "dark", label: "dark", icon: MoonIcon }
  ];

  
  const GROUP_LANGUAGE_OPTIONS: { value: Language; label: string; icon: React.ElementType }[] = [
    { value: "ru", label: "Русский", icon: RuFlag },
    { value: "en", label: "English", icon: UkFlag }
  ];

  const { t } = useTranslation();

  const logoutAndClose = async () => {
    onClose();
    logout();
  };

  return (
    <div>
      {/* Choose theme */}
      <RadioGroup<Theme>
        heading='theme'
        options={GROUP_THEME_OPTIONS}
        selected={theme}
        onChange={setTheme}
        orientation="horizontal"
      />

      {/* Choose language */}
      <RadioGroup<Language>
        heading='language'
        options={GROUP_LANGUAGE_OPTIONS}
        selected={language}
        onChange={setLanguage}
        orientation="horizontal"
        isTranslatable={false}
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={logoutAndClose}
          className="btn-base btn-delete"
        >
          {t('logout')}
        </button>
        <button
          onClick={onClose}
          className="btn-base btn-cancel"
        >
          {t('cancel')}
        </button>
      </div>
    </div>
  );
};