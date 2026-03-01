import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogInFormModal } from '../logInForm';

// Mock the authStore
const mockLogin = vi.fn();
vi.mock('../../../../store/authStore', () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ login: mockLogin, user: null, token: null, isLoading: false }),
}));

// Mock headless UI Dialog to render children directly
vi.mock('@headlessui/react', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) =>
    <div role="dialog">{children}</div>,
  DialogPanel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
  Transition: ({ children, show }: { children: React.ReactNode; show: boolean }) =>
    show ? <>{children}</> : null,
  TransitionChild: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

beforeEach(() => {
  mockLogin.mockReset();
});

describe('LogInFormModal', () => {
  const onClose = vi.fn();

  const renderForm = () => {
    return render(<LogInFormModal isOpen={true} onClose={onClose} />);
  };

  it('should render with correct title "Log In"', () => {
    renderForm();
    expect(screen.getByRole('heading', { name: 'Log In' })).toBeInTheDocument();
  });

  it('should have a "Log In" submit button', () => {
    renderForm();
    const buttons = screen.getAllByRole('button');
    const submitBtn = buttons.find(b => b.textContent === 'Log In');
    expect(submitBtn).toBeInTheDocument();
  });

  it('should show error for empty email on submit', async () => {
    renderForm();
    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('should show error for invalid email format', async () => {
    renderForm();
    const emailInput = screen.getByPlaceholderText('john@example.com');
    await userEvent.type(emailInput, 'bad-email');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  it('should show error for email with consecutive dots', async () => {
    renderForm();
    const emailInput = screen.getByPlaceholderText('john@example.com');
    await userEvent.type(emailInput, 'user..name@example.com');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Invalid email format (consecutive dots)')).toBeInTheDocument();
    });
  });

  it('should show error for empty password', async () => {
    renderForm();
    const emailInput = screen.getByPlaceholderText('john@example.com');
    await userEvent.type(emailInput, 'user@example.com');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should show error for short password', async () => {
    renderForm();
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, '12345');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('should call login with remember=false by default', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    renderForm();

    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123', false);
    });
  });

  it('should call login with remember=true when checkbox is checked', async () => {
    mockLogin.mockResolvedValueOnce(undefined);
    renderForm();

    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');
    const checkbox = screen.getByRole('checkbox');

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(checkbox);

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123', true);
    });
  });

  it('should display server error message on login failure', async () => {
    mockLogin.mockRejectedValueOnce({ error: 'Invalid credentials' });
    renderForm();

    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

  it('should display network error on TypeError', async () => {
    mockLogin.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    renderForm();

    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await userEvent.type(emailInput, 'user@example.com');
    await userEvent.type(passwordInput, 'password123');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Network error. Please check your connection.')).toBeInTheDocument();
    });
  });

  it('should clear errors when user types in a field', async () => {
    renderForm();

    // Submit empty to trigger errors
    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    // Type in the email field
    const emailInput = screen.getByPlaceholderText('john@example.com');
    await userEvent.type(emailInput, 'a');

    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
  });
});
