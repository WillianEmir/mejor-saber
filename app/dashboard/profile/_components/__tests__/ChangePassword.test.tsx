import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChangePassword from '../ChangePassword';
import { toast } from 'sonner';
import { changePassword } from '@/app/dashboard/profile/_lib/changePassword.action';
import { ChangePasswordSchema } from '@/app/dashboard/profile/_lib/changePassword.schema';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@/app/dashboard/profile/_lib/changePassword.action', () => ({
  changePassword: jest.fn(),
}));

// Mock ChangePasswordSchema
jest.mock('@/app/dashboard/profile/_lib/changePassword.schema', () => ({
  ChangePasswordSchema: {
    safeParse: jest.fn(),
  },
}));

const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockChangePassword = changePassword as jest.Mock;
const mockChangePasswordSchema = ChangePasswordSchema as any;


describe('ChangePassword', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockChangePasswordSchema.safeParse.mockReturnValue({
      success: true,
      data: {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      },
    });

    // Default mock for changePassword action (successful)
    mockChangePassword.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        success: 'Contraseña actualizada correctamente',
      }), 100)) // Add a small delay
    );
  });

  it('should render the form with all password fields and submit button', () => {
    render(<ChangePassword />);

    expect(screen.getByLabelText('Contraseña Actual')).toBeInTheDocument();
    expect(screen.getByLabelText('Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmar Nueva Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /guardar cambios/i })).toBeInTheDocument();

    expect(screen.getByLabelText('Contraseña Actual')).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('Nueva Contraseña')).toHaveAttribute('type', 'password');
    expect(screen.getByLabelText('Confirmar Nueva Contraseña')).toHaveAttribute('type', 'password');
  });

  it('should allow user to type in password fields', async () => {
    const user = userEvent.setup();
    render(<ChangePassword />);

    const currentPasswordInput = screen.getByLabelText('Contraseña Actual');
    const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');

    await user.type(currentPasswordInput, 'oldPassword123');
    await user.type(newPasswordInput, 'newPassword123');
    await user.type(confirmPasswordInput, 'newPassword123');

    expect(currentPasswordInput).toHaveValue('oldPassword123');
    expect(newPasswordInput).toHaveValue('newPassword123');
    expect(confirmPasswordInput).toHaveValue('newPassword123');
  });

  it('should handle successful password change', async () => {
    const user = userEvent.setup();
    render(<ChangePassword />);

    const currentPasswordInput = screen.getByLabelText('Contraseña Actual');
    const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');
    const submitButton = screen.getByRole('button', { name: /guardar cambios/i });

    await user.type(currentPasswordInput, 'oldPassword123');
    await user.type(newPasswordInput, 'newPassword123');
    await user.type(confirmPasswordInput, 'newPassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Guardando...');
    });

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledTimes(1);
      expect(mockChangePassword).toHaveBeenCalledWith({
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123',
      });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('Contraseña actualizada correctamente');
    });

    // Form should be reset
    await waitFor(() => {
      expect(currentPasswordInput).toHaveValue('');
      expect(newPasswordInput).toHaveValue('');
      expect(confirmPasswordInput).toHaveValue('');
    });

    // Button should be re-enabled
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Guardar Cambios');
    });
  });

  it('should handle failed password change and show error toast', async () => {
    const user = userEvent.setup();
    mockChangePassword.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve({
        error: 'La contraseña actual es incorrecta',
      }), 100))
    );

    render(<ChangePassword />);

    const currentPasswordInput = screen.getByLabelText('Contraseña Actual');
    const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');
    const submitButton = screen.getByRole('button', { name: /guardar cambios/i });

    await user.type(currentPasswordInput, 'wrongPassword');
    await user.type(newPasswordInput, 'newPassword123');
    await user.type(confirmPasswordInput, 'newPassword123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent('Guardando...');
    });

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('La contraseña actual es incorrecta');
    });

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent('Guardar Cambios');
    });
  });

  it('should show validation error when new passwords do not match', async () => {
    const user = userEvent.setup();
    mockChangePasswordSchema.safeParse.mockReturnValueOnce({
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

    render(<ChangePassword />);

    const currentPasswordInput = screen.getByLabelText('Contraseña Actual');
    const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');
    const submitButton = screen.getByRole('button', { name: /guardar cambios/i });

    await user.type(currentPasswordInput, 'oldPassword123');
    await user.type(newPasswordInput, 'newPassword123');
    await user.type(confirmPasswordInput, 'mismatch'); // Mismatched password
    await user.click(submitButton);

    expect(mockChangePassword).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('Las contraseñas no coinciden');
    });

    await waitFor(() => {
      expect(screen.getByText('Las contraseñas no coinciden')).toBeInTheDocument();
    });

    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent('Guardar Cambios');
  });

  it('should show validation error when new password is too short', async () => {
    const user = userEvent.setup();
    mockChangePasswordSchema.safeParse.mockReturnValueOnce({
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

    render(<ChangePassword />);

    const currentPasswordInput = screen.getByLabelText('Contraseña Actual');
    const newPasswordInput = screen.getByLabelText('Nueva Contraseña');
    const confirmPasswordInput = screen.getByLabelText('Confirmar Nueva Contraseña');
    const submitButton = screen.getByRole('button', { name: /guardar cambios/i });

    await user.type(currentPasswordInput, 'oldPassword123');
    await user.type(newPasswordInput, 'short'); // Too short 
    await user.type(confirmPasswordInput, 'short');
    await user.click(submitButton);

    expect(mockChangePassword).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith('La nueva contraseña debe tener al menos 6 caracteres');
    });

    await waitFor(() => {
      expect(screen.getByText('La nueva contraseña debe tener al menos 6 caracteres')).toBeInTheDocument();
    });

    expect(submitButton).not.toBeDisabled();
    expect(submitButton).toHaveTextContent('Guardar Cambios');
  });

});