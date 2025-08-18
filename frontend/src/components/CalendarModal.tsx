// src/components/CalendarModal.tsx
import { useState } from "react";
import type { FormState } from "../types"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ru } from "date-fns/locale";

type Props = {
  currentExpense: FormState;
  updateField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  onClose: () => void;
};

export function CalendarModal ({currentExpense, updateField, onClose} : Props, ) {

  const [modalDate, setModalDate] = useState<Date | null>
    (currentExpense.datetime ? new Date(currentExpense.datetime) : null);

  return (
    <div>
      <DatePicker
        selected={modalDate}
        onChange={(date) => setModalDate(date)}
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
      <button
        onClick={() => {
          if (modalDate) {
            updateField("datetime", modalDate.toISOString());
          }
          onClose();
        }}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Сохранить
      </button>
    </div>
  )
}
