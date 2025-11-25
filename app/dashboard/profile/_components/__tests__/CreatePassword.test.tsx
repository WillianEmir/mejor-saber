import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePassword from '../CreatePassword';
import { toast } from 'sonner';
import { createPassword } from '../../_lib/createPassword.action';
import { CreatePasswordSchema } from '../../_lib/createPassword.schema';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
})); 

jest.mock('@/app/dashboard/profile/_lib/createPassword.action', () => ({
  createPassword: jest.fn(),
}));

// Mock CreatePasswordSchema
jest.mock('@/app/dashboard/profile/_lib/createPassword.schema', () => ({
  CreatePasswordSchema: {
    safeParse: jest.fn(),
  },
}));

const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockCreatePassword = createPassword as jest.Mock;
const mockCreatePasswordSchema = CreatePasswordSchema as any;


describe('CreatePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockCreatePasswordSchema.safeParse.mockReturnValue({
      success: true,
      data: {
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      },
    });

    // Default mock for createPassword action (successful)
    mockCreatePassword.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        success: true,
        message: 'Contraseña creada correctamente',
      }), 100)) // Add a small delay
    );
  });

  it('should render the form with all password fields and submit button', () => {
    render(<CreatePassword />);

    expect(screen.getByLabelText('Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar contraseña/i })).toBeInTheDocument();

    expect(screen.getByLabelText('Nueva Contraseña')).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('Confirmar Nueva Contraseña')).toHaveAttribute('type', 'password');
  });

  it('should allow user to type in password fields', async () => {
    const user = userEvent.setup();
    render(<CreatePassword />);

    const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');

    await user.type(newPasswordInput, 'newPassword123');
    await user.type(confirmPasswordInput, 'newPassword123');

    expect(newPasswordInput).toHaveValue('newPassword123');
    expect(confirmPasswordInput).toHaveValue('newPassword123');
  });

  it('should handle successful password creation', async () => {
    const user = userEvent.setup();
    render(<CreatePassword />);

    const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');
    const submitButton = screen.getByRole('button', { name: /guardar contraseña/i });

    await user.type(newPasswordInput, 'newPassword123');
    await user.type(confirmPasswordInput, 'newPassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Guardando...');
    });

    await waitFor(() => {
      expect(mockCreatePassword).toHaveBeenCalledTimes(1);
      expect(mockCreatePassword).toHaveBeenCalledWith({
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Contraseña creada correctamente');
    });

    // Form should be reset
    await waitFor(() => {
      expect(newPasswordInput).toHaveValue('');
      expect(confirmPasswordInput).toHaveValue('');
    });

    // Button should be re-enabled
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Guardar Contraseña');
    });
  });

  it('should handle failed password creation and show error toast', async () => {
    const user = userEvent.setup();
    mockCreatePassword.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve({
        success: false,
        message: 'No se pudo crear la contraseña',
      }), 100))
    );

    render(<CreatePassword />);

    const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');
    const submitButton = screen.getByRole('button', { name: /guardar contraseña/i });

    await user.type(newPasswordInput, 'newPassword123');
    await user.type(confirmPasswordInput, 'newPassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Guardando...');
    });

    await waitFor(() => {
      expect(mockCreatePassword).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('No se pudo crear la contraseña');
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Guardar Contraseña');
    });
  });

  it('should show validation error when new passwords do not match', async () => {
    const user = userEvent.setup();
    mockCreatePasswordSchema.safeParse.mockReturnValueOnce({
      success: false,
      error: {
        issues: [{ message: 'Las contraseñas no coinciden', path: ['confirmPassword'] }],
        flatten: () => ({
          fieldErrors: {
            confirmPassword: ['Las contraseñas no coinciden'],
          },
        }),
      },
    });

    render(<CreatePassword />);

    const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');
    const submitButton = screen.getByRole('button', { name: /guardar contraseña/i });

    await user.type(newPasswordInput, 'newPassword123');
    await user.type(confirmPasswordInput, 'mismatch'); // Mismatched password
    await user.click(submitButton);

    expect(mockCreatePassword).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Las contraseñas no coinciden');
    });

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });

    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent('Guardar Contraseña');
  });

  it('should show validation error when new password is too short', async () => {
    const user = userEvent.setup();
    mockCreatePasswordSchema.safeParse.mockReturnValueOnce({
      success: false,
      error: {
        issues: [{ message: 'La nueva contraseña debe tener al menos 6 caracteres', path: ['newPassword'] }],
        flatten: () => ({
          fieldErrors: {
            newPassword: ['La nueva contraseña debe tener al menos 6 caracteres'],
          },
        }),
      },
    });

    render(<CreatePassword />);

    const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');
    const submitButton = screen.getByRole('button', { name: /guardar contraseña/i });

    await user.type(newPasswordInput, 'short'); // Too short 
    await user.type(confirmPasswordInput, 'short');
    await user.click(submitButton);

    expect(mockCreatePassword).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('La nueva contraseña debe tener al menos 6 caracteres');
    });

    await waitFor(() => {
      expect(screen.getByText('La nueva contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
    });

    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent('Guardar Contraseña');
  });
});
