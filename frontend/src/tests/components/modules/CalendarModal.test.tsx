// CalendarModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalendarModal } from '../../../components/modules/CalendarModal';

vi.mock('react-datepicker', () => {
  return {
    default: vi.fn(({ selected, onChange, inline }) => (
      <div data-testid="datepicker-mock">
        <div data-testid="selected-date">{selected?.toString()}</div>
        <button 
          data-testid="change-date-button"
          onClick={() => onChange(new Date('2026-01-15T12:00:00'))}
        >
          Изменить дату
        </button>
        {inline && <div data-testid="inline-calendar">Inline Calendar</div>}
      </div>
    )),
    registerLocale: vi.fn(),
  };
});

describe('CalendarModal', () => {
  const mockOnSave = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендер компонента с переданной датой', () => {
    const testDate = new Date('2026-01-01T10:00:00');
    
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

  it('вызов onClose при клике на кнопку "Закрыть"', () => {
    render(
      <CalendarModal 
        value={null} 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );

    const closeButton = screen.getByText('cancel');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('вызов onSave с выбранной датой при клике на "Сохранить"', () => {
    const testDate = new Date('2026-01-01T10:00:00');
    
    render(
      <CalendarModal 
        value={testDate} 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );

    const saveButton = screen.getByText('apply');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(testDate);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('нет вызова onSave, если дата не выбрана', () => {
    render(
      <CalendarModal 
        value={null} 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );

    const saveButton = screen.getByText('apply');
    fireEvent.click(saveButton);

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('обновление внутреннего состояния при изменении даты', () => {
    render(
      <CalendarModal 
        value={null} 
        onSave={mockOnSave} 
        onClose={mockOnClose} 
      />
    );

    const changeDateButton = screen.getByTestId('change-date-button');
    fireEvent.click(changeDateButton);

    const saveButton = screen.getByText('apply');
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(new Date('2026-01-15T12:00:00'));
  });
});