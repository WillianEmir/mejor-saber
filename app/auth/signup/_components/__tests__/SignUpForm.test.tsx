// app/auth/signup/_components/__tests__/SignUpForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import SignUpForm from '../SignUpForm'; 
import { signup } from '../../_lib/singUp.actions';

// --- Mocks ---
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('../../_lib/singUp.actions', () => ({
  signup: jest.fn(),
}));

jest.mock('@/src/components/ui/SocialMediaLogInButton', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="social-media-login-button"></div>,
    };
});

// --- Test Variables ---
const mockUseRouter = useRouter as jest.Mock;
const mockSignup = signup as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;

describe('SignUpForm', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form correctly and the submit button should be disabled', () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa tu contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText(/acepto los/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /registrarse/i })).toBeDisabled();
  });

  it('should enable the submit button when terms are accepted', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);
    
    const termsCheckbox = screen.getByLabelText(/acepto los/i);
    const submitButton = screen.getByRole('button', { name: /registrarse/i });

    expect(submitButton).toBeDisabled();
    await user.click(termsCheckbox);
    expect(submitButton).not.toBeDisabled();
    await user.click(termsCheckbox);
    expect(submitButton).toBeDisabled();
  });

  it('should allow user to type in all fields', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/nombre/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Ingresa tu contraseña'), 'password123');

    expect(screen.getByLabelText(/nombre/i)).toHaveValue('Test User');
    expect(screen.getByLabelText(/email/i)).toHaveValue('test@example.com');
    expect(screen.getByPlaceholderText('Ingresa tu contraseña')).toHaveValue('password123');
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    const passwordInput = screen.getByPlaceholderText('Ingresa tu contraseña');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const passwordToggle = passwordInput.nextElementSibling;
    expect(passwordToggle).toBeInTheDocument();

    await user.click(passwordToggle!);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(passwordToggle!);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should handle successful signup', async () => {
    const user = userEvent.setup();
    const router = { push: jest.fn() };
    mockUseRouter.mockReturnValue(router);
    mockSignup.mockResolvedValue({ success: true, message: '¡Registro exitoso!' });

    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/nombre/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Ingresa tu contraseña'), 'Password123!');
    await user.click(screen.getByLabelText(/acepto los/i));

    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    await waitFor(() => expect(submitButton).toBeDisabled());
    expect(submitButton).toHaveTextContent('Registrando...');

    await waitFor(() => {
        expect(mockSignup).toHaveBeenCalledTimes(1);
        expect(mockToastSuccess).toHaveBeenCalledWith('¡Registro exitoso!');
        expect(router.push).toHaveBeenCalledWith('/auth/signin');
    });

    // Check if form was reset
    expect(screen.getByLabelText(/nombre/i)).toHaveValue('');
  });

  it('should handle failed signup', async () => {
    const user = userEvent.setup();
    mockSignup.mockResolvedValue({ success: false, message: 'El email ya está en uso' });

    render(<SignUpForm />);

    await user.type(screen.getByLabelText(/nombre/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Ingresa tu contraseña'), 'Password123!');
    await user.click(screen.getByLabelText(/acepto los/i));
    
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledTimes(1);
      expect(mockToastError).toHaveBeenCalledWith('El email ya está en uso');
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
