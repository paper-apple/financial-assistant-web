// // // CalendarModal.test.tsx
// import { render, screen, fireEvent } from "@testing-library/react";
// import { describe, vi, it, expect } from "vitest";
// import { CalendarModal } from "../../../components/CalendarModal";

// // describe("CalendarModal", () => {
// //   const setup = (props = {}) => {
// //     const defaultProps = {
// //       value: new Date("2025-01-01T12:00:00"),
// //       onSave: vi.fn(),
// //       onClose: vi.fn(),
// //     };
// //     return render(<CalendarModal {...defaultProps} {...props} />);
// //   };

// //   it("рендерит DatePicker с переданным значением", () => {
// //     setup();
// //     // react-datepicker рендерит выбранную дату в input (скрытый, но доступный по role="textbox")
// //     // const input = screen.getByRole("textbox") as HTMLInputElement;
// //     // expect(input.value).toContain("01.01.2025"); // формат dd.MM.yyyy HH:mm
// //     const input = screen.queryByRole("textbox") as HTMLInputElement;
// //     expect(input.value).toContain("01.01.2025"); // формат dd.MM.yyyy HH:mm
// // // expect(input).toBeNull(); // в inline-режиме это нормально
// //   });

// //   it("кнопка 'Закрыть' вызывает onClose", () => {
// //     const onClose = vi.fn();
// //     setup({ onClose });

// //     fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
// //     expect(onClose).toHaveBeenCalled();
// //   });

// //   it("кнопка 'Сохранить' вызывает onSave и onClose, если дата есть", () => {
// //     const onSave = vi.fn();
// //     const onClose = vi.fn();
// //     const date = new Date("2025-01-01T12:00:00");

// //     setup({ value: date, onSave, onClose });

// //     fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

// //     expect(onSave).toHaveBeenCalledWith(date);
// //     expect(onClose).toHaveBeenCalled();
// //   });

// //   it("кнопка 'Сохранить' не вызывает onSave, если даты нет", () => {
// //     const onSave = vi.fn();
// //     const onClose = vi.fn();

// //     setup({ value: null, onSave, onClose });

// //     fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

// //     expect(onSave).not.toHaveBeenCalled();
// //     expect(onClose).toHaveBeenCalled();
// //   });

// //   // it("при выборе новой даты сохраняется именно она", () => {
// //   //   const onSave = vi.fn();
// //   //   const onClose = vi.fn();
// //   //   setup({ value: new Date("2025-01-01T12:00:00"), onSave, onClose });

// //   //   // react-datepicker рендерит input, можно симулировать изменение
// //   //   const input = screen.getByRole("textbox") as HTMLInputElement;
// //   //   fireEvent.change(input, { target: { value: "02.01.2025 15:30" } });

// //   //   fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

// //   //   // Проверяем, что onSave вызван с новой датой
// //   //   expect(onSave).toHaveBeenCalled();
// //   //   const savedDate = onSave.mock.calls[0][0] as Date;
// //   //   expect(savedDate.getDate()).toBe(2);
// //   //   expect(savedDate.getHours()).toBe(15);
// //   //   expect(savedDate.getMinutes()).toBe(30);
// //   // });
// // });


// // src/components/__tests__/CalendarModal.test.tsx
// // import { render, screen, fireEvent } from "@testing-library/react";
// // import { CalendarModal } from "../CalendarModal";

// describe("CalendarModal (inline)", () => {
//   const setup = (props = {}) => {
//     const defaultProps = {
//       value: new Date("2025-01-01T12:00:00"),
//       onSave: vi.fn(),
//       onClose: vi.fn(),
//     };
//     return render(<CalendarModal {...defaultProps} {...props} />);
//   };

//   it("рендерит календарь и выбранную дату", () => {
//     setup();
//     // react-datepicker в inline-режиме рендерит кнопки дней
//     expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
//   });

//   it("кнопка 'Закрыть' вызывает onClose", () => {
//     const onClose = vi.fn();
//     setup({ onClose });

//     fireEvent.click(screen.getByRole("button", { name: "Закрыть" }));
//     expect(onClose).toHaveBeenCalled();
//   });

//   it("кнопка 'Сохранить' вызывает onSave и onClose с выбранной датой", () => {
//     const onSave = vi.fn();
//     const onClose = vi.fn();
//     setup({ onSave, onClose });

//     // выбираем 2 января в календаре
//     // const dayButton = screen.getByRole("button", { name: "2" });
//     const dayButton = screen.getByRole("button", { name: /2.*января/i });
//     fireEvent.click(dayButton);

//     fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

//     expect(onSave).toHaveBeenCalled();
//     const savedDate = onSave.mock.calls[0][0] as Date;
//     expect(savedDate.getDate()).toBe(2);
//     expect(savedDate.getMonth()).toBe(0); // январь
//     expect(onClose).toHaveBeenCalled();
//   });

//   it("кнопка 'Сохранить' не вызывает onSave, если даты нет", () => {
//     const onSave = vi.fn();
//     const onClose = vi.fn();
//     setup({ value: null, onSave, onClose });

//     fireEvent.click(screen.getByRole("button", { name: "Сохранить" }));

//     expect(onSave).not.toHaveBeenCalled();
//     expect(onClose).toHaveBeenCalled();
//   });
// });



// src/components/__tests__/CalendarModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalendarModal } from '../../../components/CalendarModal';
// import { CalendarModal } from '../CalendarModal';

// Мокаем react-datepicker чтобы избежать сложностей с рендерингом
vi.mock('react-datepicker', () => {
  return {
    default: vi.fn(({ selected, onChange, inline }) => (
      <div data-testid="datepicker-mock">
        <div data-testid="selected-date">{selected?.toString()}</div>
        <button 
          data-testid="change-date-button"
          onClick={() => onChange(new Date('2025-01-15T12:00:00'))}
        >
          Изменить дату
        </button>
        {inline && <div data-testid="inline-calendar">Inline Calendar</div>}
      </div>
    )),
  };
});

describe('CalendarModal', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит компонент с переданной датой', () => {
    const testDate = new Date('2025-01-01T10:00:00');
    
    render(
      <CalendarModal 
        value={testDate} 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );

    expect(screen.getByTestId('datepicker-mock')).toBeInTheDocument();
    expect(screen.getByText('Inline Calendar')).toBeInTheDocument();
  });

  it('вызывает onClose при клике на кнопку "Закрыть"', () => {
    render(
      <CalendarModal 
        value={null} 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );

    const closeButton = screen.getByText('Закрыть');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('вызывает onSave с выбранной датой при клике на "Сохранить"', () => {
    const testDate = new Date('2025-01-01T10:00:00');
    
    render(
      <CalendarModal 
        value={testDate} 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );

    const saveButton = screen.getByText('Сохранить');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(testDate);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('не вызывает onSave если дата не выбрана', () => {
    render(
      <CalendarModal 
        value={null} 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );

    const saveButton = screen.getByText('Сохранить');
    fireEvent.click(saveButton);

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('обновляет внутреннее состояние при изменении даты', () => {
    render(
      <CalendarModal 
        value={null} 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );

    const changeDateButton = screen.getByTestId('change-date-button');
    fireEvent.click(changeDateButton);

    const saveButton = screen.getByText('Сохранить');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(new Date('2025-01-15T12:00:00'));
  });
});