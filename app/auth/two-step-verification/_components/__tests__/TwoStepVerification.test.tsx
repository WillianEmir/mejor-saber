import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TwoStepVerification from '../TwoStepVerification';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { newPasswordTwoStepVerification } from '@/app/auth/two-step-verification/_lib/twoStepVerification.actions';
import { NewPasswordTwoStepVerificationSchema } from '@/app/auth/two-step-verification/_lib/twoStepVerification.schema';

// Mock dependencies
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

jest.mock('@/app/auth/two-step-verification/_lib/twoStepVerification.actions', () => ({
  newPasswordTwoStepVerification: jest.fn(),
}));

// Mock NewPasswordTwoStepVerificationSchema para evitar depender de Zod en algunos casos de test
// Si quisiéramos testear la validación del esquema, no lo mockearíamos así o lo haríamos más específico
jest.mock('@/app/auth/two-step-verification/_lib/twoStepVerification.schema', () => ({
  NewPasswordTwoStepVerificationSchema: {
    safeParse: jest.fn(),
  },
}));


const mockUseRouter = useRouter as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockNewPasswordTwoStepVerification = newPasswordTwoStepVerification as jest.Mock;
const mockNewPasswordTwoStepVerificationSchema = NewPasswordTwoStepVerificationSchema as any;


describe('TwoStepVerification', () => {
    let mockPush: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockPush = jest.fn();
        mockUseRouter.mockReturnValue({
            push: mockPush,
        });

        // Default mock for schema validation (successful)
        mockNewPasswordTwoStepVerificationSchema.safeParse.mockReturnValue({
            success: true,
            data: { password: 'password123', token: '123456' },
        });

        // Default mock for server action (successful)
        mockNewPasswordTwoStepVerification.mockImplementation(() =>
            new Promise(resolve => setTimeout(() => resolve({
                success: true,
                message: 'Contraseña actualizada!',
            }), 100)) // Add a small delay
        );
    });

    it('should render the form with all fields', () => {
        render(<TwoStepVerification />);

        expect(screen.getByRole('heading', { name: /crea una nueva contraseña/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/código de verificación/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/nueva contraseña/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /confirmar nueva contraseña/i })).toBeInTheDocument();
    });

    it('should show password as masked by default', () => {
        render(<TwoStepVerification />);
        const passwordInput = screen.getByLabelText(/nueva contraseña/i);
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should allow user to type in token and password fields', async () => {
        const user = userEvent.setup();
        render(<TwoStepVerification />);

        const tokenInput = screen.getByLabelText(/código de verificación/i);
        const passwordInput = screen.getByLabelText(/nueva contraseña/i);

        await user.type(tokenInput, '123456');
        await user.type(passwordInput, 'newpassword');

        expect(tokenInput).toHaveValue('123456');
        expect(passwordInput).toHaveValue('newpassword');
    });

    it('should handle successful password update and redirect', async () => {
        const user = userEvent.setup();
        render(<TwoStepVerification />);

        const tokenInput = screen.getByLabelText(/código de verificación/i);
        const passwordInput = screen.getByLabelText(/nueva contraseña/i);
        const submitButton = screen.getByRole('button', { name: /confirmar nueva contraseña/i });

        await user.type(tokenInput, '123456');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        // Check loading state
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
            expect(submitButton).toHaveTextContent('Confirmando...');
        });

        await waitFor(() => {
            expect(mockNewPasswordTwoStepVerification).toHaveBeenCalledTimes(1);
            const formData = mockNewPasswordTwoStepVerification.mock.calls[0][0];
            expect(formData.get('token')).toBe('123456');
            expect(formData.get('password')).toBe('password123');
        });

        await waitFor(() => {
            expect(mockToastSuccess).toHaveBeenCalledWith('Contraseña actualizada!');
        });

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/auth/signin');
        });

        // Ensure button is re-enabled after success
        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
            expect(submitButton).toHaveTextContent('Confirmar Nueva Contraseña');
        });
    });

    it('should handle failed password update and show error toast', async () => {
        const user = userEvent.setup();
        mockNewPasswordTwoStepVerification.mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({
                success: false,
                message: '¡Código no válido!',
            }), 100)) // Add a small delay
        );

        render(<TwoStepVerification />);

        const tokenInput = screen.getByLabelText(/código de verificación/i);
        const passwordInput = screen.getByLabelText(/nueva contraseña/i);
        const submitButton = screen.getByRole('button', { name: /confirmar nueva contraseña/i });

        await user.type(tokenInput, 'invalid');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        // Check loading state
        await waitFor(() => {
            expect(submitButton).toBeDisabled();
            expect(submitButton).toHaveTextContent('Confirmando...');
        });

        await waitFor(() => {
            expect(mockNewPasswordTwoStepVerification).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('¡Código no válido!');
        });

        expect(mockPush).not.toHaveBeenCalled();

        // Ensure button is re-enabled after failure
        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
            expect(submitButton).toHaveTextContent('Confirmar Nueva Contraseña');
        });
    });

    it('should show validation errors for invalid input (password too short)', async () => {
        const user = userEvent.setup();
        // Mock the schema to return a validation error
        mockNewPasswordTwoStepVerificationSchema.safeParse.mockReturnValueOnce({
            success: false,
            error: {
                issues: [{ message: 'Mínimo 6 caracteres', path: ['password'] }],
                flatten: () => ({
                    fieldErrors: {
                        password: ['Mínimo 6 caracteres'],
                    },
                }),
            },
        });

        render(<TwoStepVerification />);

        const tokenInput = screen.getByLabelText(/código de verificación/i);
        const passwordInput = screen.getByLabelText(/nueva contraseña/i);
        const submitButton = screen.getByRole('button', { name: /confirmar nueva contraseña/i });

        await user.type(tokenInput, '123456');
        await user.type(passwordInput, '123'); // Invalid password
        await user.click(submitButton);

        expect(mockNewPasswordTwoStepVerification).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
        
        // Wait for the toast to appear
        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Mínimo 6 caracteres');
        });
        
        // Button should not have entered loading state and should remain enabled
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveTextContent('Confirmar Nueva Contraseña');

        // Check for form message directly in the DOM
        await waitFor(() => {
            expect(screen.getByText('Mínimo 6 caracteres')).toBeInTheDocument();
        });
    });

    it('should show validation errors for invalid input (token empty)', async () => {
        const user = userEvent.setup();
        // Mock the schema to return a validation error
        mockNewPasswordTwoStepVerificationSchema.safeParse.mockReturnValueOnce({
            success: false,
            error: {
                issues: [{ message: 'El código es obligatorio', path: ['token'] }],
                flatten: () => ({
                    fieldErrors: {
                        token: ['El código es obligatorio'],
                    },
                }),
            },
        });

        render(<TwoStepVerification />);

        // const tokenInput = screen.getByLabelText(/código de verificación/i); // No se escribe en el token
        const passwordInput = screen.getByLabelText(/nueva contraseña/i);
        const submitButton = screen.getByRole('button', { name: /confirmar nueva contraseña/i });

        // await user.type(tokenInput, ''); // Empty token - Eliminado
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        expect(mockNewPasswordTwoStepVerification).not.toHaveBeenCalled();
        expect(mockPush).not.toHaveBeenCalled();
        
        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('El código es obligatorio');
        });
        
        expect(submitButton).not.toBeDisabled();
        expect(submitButton).toHaveTextContent('Confirmar Nueva Contraseña');

        await waitFor(() => {
            expect(screen.getByText('El código es obligatorio')).toBeInTheDocument();
        });
    });
});

