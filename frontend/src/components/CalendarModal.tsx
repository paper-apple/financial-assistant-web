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
          timeCaption="Время"
          inline
          fixedHeight
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          className="mt-3 w-full text-sm border rounded-md hover:bg-gray-100"
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
          className="mt-3 w-full text-sm bg-blue-300 hover:bg-blue-500 text-white py-2 border border-blue-300 rounded-md"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}