// AuthModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthModal } from '../../../components/modules/AuthModal';

describe('AuthModal Component', () => {
  const mockOnAuth = vi.fn();
  const mockOnToggleMode = vi.fn();

  const defaultProps = {
    isOpen: true,
    isLoginMode: true,
    error: null,
    onAuth: mockOnAuth,
    onToggleMode: mockOnToggleMode,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('не рендерится, если isOpen === false', () => {
    render(<AuthModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument();
  });

  it('рендерит форму в режиме логина', () => {
    render(<AuthModal {...defaultProps} />);
    
    expect(screen.getByRole('heading', { name: 'enter' })).toBeInTheDocument();
    expect(screen.getByTestId('username')).toBeInTheDocument();
    expect(screen.getByTestId('password')).toBeInTheDocument();
  });

  it('вызывает onAuth при сабмите формы с введенными данными', async () => {
    render(<AuthModal {...defaultProps} />);

    const usernameInput = screen.getByTestId('username');
    const passwordInput = screen.getByTestId('password');
    const submitButton = screen.getByRole('button', { name: 'enter' });

    fireEvent.change(usernameInput, { target: { value: 'myuser' } });
    fireEvent.change(passwordInput, { target: { value: 'mypass' } });
    
    fireEvent.click(submitButton);

    expect(mockOnAuth).toHaveBeenCalledWith('myuser', 'mypass');
  });

  it('вызывает onAuth с корректными демо-данными для RU языка', async () => {
    render(<AuthModal {...defaultProps} />);
    
    const demoButton = screen.getByRole('button', { name: 'demo' });
    fireEvent.click(demoButton);

    expect(mockOnAuth).toHaveBeenCalledWith('testuser', '1234Ab');
  });
});