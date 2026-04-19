// RadioGroup.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import type { ElementType } from 'react';
import { RadioGroup } from '../../../components/ui/RadioGroup';

const TestIcon1 = () => <svg data-testid="icon1" />;
const TestIcon2 = () => <svg data-testid="icon2" />;
const TestIcon3 = () => <svg data-testid="icon3" />;

type TestValue = 'option1' | 'option2' | 'option3';

const testOptions = [
  { value: 'option1' as const, label: 'Option 1', icon: TestIcon1 as ElementType },
  { value: 'option2' as const, label: 'Option 2', icon: TestIcon2 as ElementType },
  { value: 'option3' as const, label: 'Option 3', icon: TestIcon3 as ElementType },
];

describe('RadioGroup', () => {
  const defaultProps = {
    heading: 'sort' as const,
    options: testOptions,
    selected: 'option1' as TestValue,
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('рендерит заголовок и все опции', () => {
    render(<RadioGroup {...defaultProps} />);
    
    expect(screen.getByText('sort')).toBeInTheDocument();
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
    
    expect(screen.getByTestId('icon1')).toBeInTheDocument();
    expect(screen.getByTestId('icon2')).toBeInTheDocument();
    expect(screen.getByTestId('icon3')).toBeInTheDocument();
  });

  it('применяет активный стиль к выбранной опции', () => {
    render(<RadioGroup {...defaultProps} selected="option2" />);
    
    const buttons = screen.getAllByRole('button');
    const selectedButton = buttons[1];
    
    expect(selectedButton).toHaveClass('bg-(--checked-option)');
    
    expect(buttons[0]).not.toHaveClass('bg-(--checked-option)');
    expect(buttons[2]).not.toHaveClass('bg-(--checked-option)');
  });

  it('вызывает onChange с правильным значением при клике на опцию', () => {
    const mockOnChange = vi.fn();
    render(<RadioGroup {...defaultProps} onChange={mockOnChange} />);
    
    const buttons = screen.getAllByRole('button');
    
    fireEvent.click(buttons[1]);
    expect(mockOnChange).toHaveBeenCalledWith('option2');
    
    fireEvent.click(buttons[2]);
    expect(mockOnChange).toHaveBeenCalledWith('option3');
    
    expect(mockOnChange).toHaveBeenCalledTimes(2);
  });

  it('применяет правильные CSS классы для вертикальной и горизонтальной ориентации', () => {
    const { rerender } = render(<RadioGroup {...defaultProps} orientation="vertical" />);
    
    const container = document.querySelector('.options-container');
    expect(container).toHaveClass('flex-col');
    expect(container).toHaveClass('gap-0.5');
    expect(container).not.toHaveClass('gap-2.5');
    
    rerender(<RadioGroup {...defaultProps} orientation="horizontal" />);
    
    expect(container).toHaveClass('gap-2.5');
    expect(container).not.toHaveClass('flex-col');
    expect(container).not.toHaveClass('gap-0.5');
  });
});