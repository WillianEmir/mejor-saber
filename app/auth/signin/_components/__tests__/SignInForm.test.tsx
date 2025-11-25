// app/auth/signin/_components/__tests__/SignInForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignInForm from '../SignInForm'; 
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { login } from '@/app/auth/signin/_lib/signin.actions';
import { redirectByRole } from '@/src/lib/utils.client';
import { useRouter } from 'next/navigation';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
    update: jest.fn(),
  })),
}));

jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@/app/auth/signin/_lib/signin.actions', () => ({
  login: jest.fn(),
}));

jest.mock('@/src/lib/utils.client', () => ({
  ...jest.requireActual('@/src/lib/utils.client'),
  redirectByRole: jest.fn(),
}));

jest.mock('@/src/components/ui/SocialMediaLogInButton', () => {
    return {
        __esModule: true,
        default: () => <div data-testid="social-media-login-button"></div>,
    };
});

// Mocking the UserRole enum locally to avoid Prisma client dependency in unit tests
const UserRole = {
  ADMIN: 'ADMIN',
  ADMINSCHOOL: 'ADMINSCHOOL',
  USER: 'USER',
  DOCENTE: 'DOCENTE',
};

const mockUseSession = useSession as jest.Mock;
const mockLogin = login as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockRedirectByRole = redirectByRole as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;


describe('SignInForm', () => {
    
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        mockUseSession.mockReturnValue({
            data: null,
            status: 'unauthenticated',
            update: jest.fn(),
        });
    });

    it('should render the form with all fields', () => {
        render(<SignInForm />);

        // Check for form elements
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Ingresa tu contraseña')).toBeInTheDocument();
        expect(screen.getByLabelText(/mantenerme conectado/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();

        // Check for links
        expect(screen.getByRole('link', { name: /volver al inicio/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /¿Olvidaste tu contraseña?/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /regístrate/i })).toBeInTheDocument();
        
        // Check for social media login button
        expect(screen.getByTestId('social-media-login-button')).toBeInTheDocument();
    });

    it('should allow user to type in email and password fields', async () => {
        const user = userEvent.setup();
        render(<SignInForm />);

        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByPlaceholderText('Ingresa tu contraseña');

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('password123');
    });

    it('should toggle password visibility', async () => {
        const user = userEvent.setup();
        render(<SignInForm />);

        const passwordInput = screen.getByPlaceholderText('Ingresa tu contraseña');
        expect(passwordInput).toHaveAttribute('type', 'password');

        // The toggle is a span, let's get it by its parent div, then find the span.
        const passwordToggle = passwordInput.nextElementSibling;
        
        expect(passwordToggle).toBeInTheDocument();

        // Click to show password
        await user.click(passwordToggle!);
        expect(passwordInput).toHaveAttribute('type', 'text');

        // Click to hide password again
        await user.click(passwordToggle!);
        expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should handle successful login', async () => {
        const user = userEvent.setup();
        const mockUpdate = jest.fn();
        mockUseSession.mockReturnValue({
            data: null,
            status: 'unauthenticated',
            update: mockUpdate,
        });
        mockLogin.mockResolvedValue({ success: true });

        render(<SignInForm />);
        
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByPlaceholderText('Ingresa tu contraseña');
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'password123');
        await user.click(submitButton);

        // Check button loading state
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Iniciando...');

        // Wait for promises to resolve
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledTimes(1);
        });

        // Check for success toast and session update
        await waitFor(() => {
            expect(mockToastSuccess).toHaveBeenCalledWith('¡Bienvenido de nuevo!');
        });
        
        await waitFor(() => {
            expect(mockUpdate).toHaveBeenCalledTimes(1);
        });
        
        // Wait for the button to be re-enabled
        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
        expect(submitButton).toHaveTextContent('Iniciar Sesión');
    });

    it('should handle failed login', async () => {
        const user = userEvent.setup();
        mockLogin.mockResolvedValue({ success: false, message: 'Invalid credentials' });

        render(<SignInForm />);
        
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getByPlaceholderText('Ingresa tu contraseña');
        const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

        await user.type(emailInput, 'test@example.com');
        await user.type(passwordInput, 'wrongpassword');
        await user.click(submitButton);

        // Check button loading state
        expect(submitButton).toBeDisabled();
        expect(submitButton).toHaveTextContent('Iniciando...');

        // Wait for promises to resolve
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledTimes(1);
        });

        // Check for error toast
        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Invalid credentials');
        });
        
        // Wait for the button to be re-enabled
        await waitFor(() => {
            expect(submitButton).not.toBeDisabled();
        });
        expect(submitButton).toHaveTextContent('Iniciar Sesión');
    });

    it('should redirect if user is already authenticated', async () => {
        const router = { push: jest.fn() };
        mockUseRouter.mockReturnValue(router);
        mockUseSession.mockReturnValue({
            data: {
                user: {
                    role: UserRole.USER,
                },
            },
            status: 'authenticated',
            update: jest.fn(),
        });

        render(<SignInForm />);

        await waitFor(() => {
            expect(mockRedirectByRole).toHaveBeenCalledWith(UserRole.USER, expect.any(Object));
        });
    });
});
