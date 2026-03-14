// CalendarModal.tsx
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";


type CalendarModalProps = {
  value: Date | null;
  onSave: (date: Date) => void;
  onClose: () => void;
};

export function CalendarModal({ value, onSave, onClose }: CalendarModalProps) {
  const [modalDate, setModalDate] = useState<Date | null>(value);

  return (
    <div data-testid="calendar-modal">
      <div className="flex justify-center">
        <DatePicker
          selected={modalDate}
          onChange={(date: Date | null) => setModalDate(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          locale={ru}
          dateFormat="dd.MM.yyyy HH:mm"
          calendarClassName="ios-calendar"
          timeCaption=""
          inline
          fixedHeight
        />
      </div>
      <div className="flex gap-2 pt-2 px-1">
        <button
          onClick={onClose}
          className="w-full btn-base btn-cancel"
        >
          Закрыть
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
          Сохранить
        </button>
      </div>
    </div>
  );
}