import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import AuthModal from '../AuthModal';

function setup(mode = 'login') {
  return render(
    <AuthModal
      mode={mode}
      onClose={() => {}}
      onAuthSuccess={() => {}}
    />
  );
}

describe('AuthModal password visibility', () => {
  it('toggles password visibility in login mode', () => {
    setup('login');
    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    // Default type is password
    expect(passwordInput).toHaveAttribute('type', 'password');
    // Click to show password
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    // Button should now say hide password
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument();
    // Click again to hide
    fireEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility in register mode', () => {
    setup('register');
    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleBtn = screen.getByRole('button', { name: /show password/i });
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
    fireEvent.click(screen.getByRole('button', { name: /hide password/i }));
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
}); 