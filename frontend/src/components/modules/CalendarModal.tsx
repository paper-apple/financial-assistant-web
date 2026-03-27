// CalendarModal.tsx
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enUS, Locale, ru } from "date-fns/locale";
import { Language, useSettings } from "../../context/SettingsContext";
import { useTranslation } from "../../hooks/useTranslation";


type CalendarModalProps = {
  value: Date | null;
  onSave: (date: Date) => void;
  onClose: () => void;
};

registerLocale('ru', ru);
registerLocale('en', enUS);

const localeMap: Record<Language, Locale> = {
  ru: ru,
  en: enUS,
};

export function CalendarModal({ value, onSave, onClose }: CalendarModalProps) {
  const [modalDate, setModalDate] = useState<Date | null>(value);
  const { language } = useSettings();
  const currentLocale = localeMap[language];

  const { t } = useTranslation()
  
  return (
    <div data-testid="calendar-modal">
      <div className="flex justify-center">
        <DatePicker
          selected={modalDate}
          onChange={(date: Date | null) => setModalDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={30}
          locale={currentLocale}
          dateFormat="dd.MM.yyyy HH:mm"
          calendarClassName="ios-calendar"
          timeCaption=""
          inline
          fixedHeight
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={onClose}
          className="w-full btn-base btn-cancel"
        >
          {t('cancel')}
        </button>
        <button
          onClick={() => {
            if (modalDate) {
              onSave(modalDate);
            }
            onClose();
          }}
          className="w-full btn-base btn-confirm"
        >
          {t('apply')}
        </button>
      </div>
    </div>
  );
}