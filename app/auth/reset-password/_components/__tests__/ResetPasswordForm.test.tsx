// app/auth/reset-password/_components/__tests__/ResetPasswordForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
 
import ResetPasswordForm from '../ResetPasswordForm';
import { reset } from '../../_lib/resetPassword.actions'; // Corrected import to 'reset'

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

jest.mock('../../_lib/resetPassword.actions', () => ({
  reset: jest.fn(), // Corrected mock to 'reset'
}));

// --- Test Variables ---
const mockUseRouter = useRouter as jest.Mock;
const mockReset = reset as jest.Mock; // Corrected test variable name
const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;

describe('ResetPasswordForm', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the form correctly', () => {
    render(<ResetPasswordForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar enlace de reinicio/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('should allow user to type in the email field', async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should handle successful email send', async () => {
    const user = userEvent.setup();
    const router = { push: jest.fn() }; // Need router mock for redirect assertion
    mockUseRouter.mockReturnValue(router);
    mockReset.mockResolvedValue({ success: true, message: 'Enlace de recuperación enviado' });

    render(<ResetPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /enviar enlace de reinicio/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => expect(submitButton).toHaveTextContent('Enviando...')); // Assert loading text immediately

    await waitFor(() => {
        expect(mockReset).toHaveBeenCalledTimes(1);
        expect(mockToastSuccess).toHaveBeenCalledWith('Enlace de recuperación enviado');
        expect(emailInput).toHaveValue(''); // Form reset
        expect(router.push).toHaveBeenCalledWith('/auth/two-step-verification'); // Assert redirection
    });

    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent('Enviar Enlace de Reinicio');
  });

  it('should handle failed email send', async () => {
    const user = userEvent.setup();
    mockReset.mockResolvedValue({ success: false, message: 'El email no se encuentra registrado' });

    render(<ResetPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /enviar enlace de reinicio/i });

    await user.type(emailInput, 'nonexistent@example.com');
    await user.click(submitButton);

    await waitFor(() => expect(submitButton).toHaveTextContent('Enviando...')); // Assert loading text immediately

    await waitFor(() => {
        expect(mockReset).toHaveBeenCalledTimes(1);
        expect(mockToastError).toHaveBeenCalledWith('El email no se encuentra registrado');
    });

    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent('Enviar Enlace de Reinicio');
  });
});
