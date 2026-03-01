import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignUpFormModal } from '../signUpForm';

// Mock the authStore
const mockRegister = vi.fn();
vi.mock('../../../../store/authStore', () => ({
  useAuthStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({ register: mockRegister, user: null, token: null, isLoading: false }),
}));

// Mock headless UI Dialog
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
  mockRegister.mockReset();
});

describe('SignUpFormModal', () => {
  const onClose = vi.fn();

  const renderForm = () => {
    return render(<SignUpFormModal isOpen={true} onClose={onClose} />);
  };

  it('should render with title "Create Account"', () => {
    renderForm();
    expect(screen.getByText('Create Account')).toBeInTheDocument();
  });

  // Name validation tests
  it('should show error for empty name', async () => {
    renderForm();
    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
    });
  });

  it('should show error for name with only 1 character', async () => {
    renderForm();
    const nameInput = screen.getByPlaceholderText('John Doe');
    await userEvent.type(nameInput, 'A');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Full name must be at least 2 characters')).toBeInTheDocument();
    });
  });

  it('should show error for name with invalid characters', async () => {
    renderForm();
    const nameInput = screen.getByPlaceholderText('John Doe');
    await userEvent.type(nameInput, 'John123');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Name contains invalid characters/)).toBeInTheDocument();
    });
  });

  it('should show error for name with consecutive spaces', async () => {
    renderForm();
    const nameInput = screen.getByPlaceholderText('John Doe');
    await userEvent.type(nameInput, 'John  Doe');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Multiple consecutive spaces are not allowed')).toBeInTheDocument();
    });
  });

  // Email validation tests
  it('should show error for empty email', async () => {
    renderForm();
    const nameInput = screen.getByPlaceholderText('John Doe');
    await userEvent.type(nameInput, 'John Doe');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('should show error for invalid email', async () => {
    renderForm();
    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'not-email');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });

  // Password validation tests
  it('should show error for empty password', async () => {
    renderForm();
    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  it('should show error for short password', async () => {
    renderForm();
    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInputs[0], '12345');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  // Confirm password tests
  it('should show error for password mismatch', async () => {
    renderForm();
    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInputs[0], 'password123');
    await userEvent.type(passwordInputs[1], 'different');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  // Successful submit
  it('should call register on valid submit', async () => {
    mockRegister.mockResolvedValueOnce(undefined);
    renderForm();

    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInputs[0], 'password123');
    await userEvent.type(passwordInputs[1], 'password123');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('john@example.com', 'password123', 'John Doe');
    });
  });

  // Error handling
  it('should display server error message on failure', async () => {
    mockRegister.mockRejectedValueOnce({ error: 'Email already in use' });
    renderForm();

    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInputs[0], 'password123');
    await userEvent.type(passwordInputs[1], 'password123');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Email already in use')).toBeInTheDocument();
    });
  });

  it('should display network error on TypeError', async () => {
    mockRegister.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    renderForm();

    const nameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');

    await userEvent.type(nameInput, 'John Doe');
    await userEvent.type(emailInput, 'john@example.com');
    await userEvent.type(passwordInputs[0], 'password123');
    await userEvent.type(passwordInputs[1], 'password123');

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Network error. Please check your connection.')).toBeInTheDocument();
    });
  });

  it('should clear errors when user types in a field', async () => {
    renderForm();

    const form = screen.getByRole('dialog').querySelector('form')!;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
    });

    const nameInput = screen.getByPlaceholderText('John Doe');
    await userEvent.type(nameInput, 'a');

    expect(screen.queryByText('Full name is required')).not.toBeInTheDocument();
  });
});
