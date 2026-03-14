// AuthModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, vi, it, expect } from 'vitest';
import { AuthModal } from '../../../components/modules/AuthModal';

describe('AuthModal', () => {
  const mockOnAuth = vi.fn();
  const mockOnToggle = vi.fn();

  it('рендер', () => {
    render(
      <AuthModal
        isOpen={true}
        isLoginMode={true}
        error=""
        onAuth={mockOnAuth}
        onToggleMode={mockOnToggle}
      />
    );
    
    expect(screen.getByText('Вход')).toBeInTheDocument();
  });

  it('вызов onAuth при сабмите', () => {
    render(
      <AuthModal
        isOpen={true}
        isLoginMode={true}
        error=""
        onAuth={mockOnAuth}
        onToggleMode={mockOnToggle}
      />
    );

    fireEvent.change(screen.getByTestId('username'), {
      target: { value: 'test' },
    });
    fireEvent.change(screen.getByTestId('password'), {
      target: { value: 'Ab4321' },
    });

    fireEvent.click(screen.getByText('Войти'));
    
    expect(mockOnAuth).toHaveBeenCalledWith('test', 'Ab4321');
  });

  it('демо-вход', () => {
    render(
      <AuthModal
        isOpen={true}
        isLoginMode={true}
        error=""
        onAuth={mockOnAuth}
        onToggleMode={mockOnToggle}
      />
    );

    fireEvent.click(screen.getByText('Войти как демо-пользователь'));

    expect(mockOnAuth).toHaveBeenCalledWith('testuser', '1234Ab');
  });
});