// __tests__/integration/auth.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; 
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import SignInPage from '@/app/auth/signin/page';
import SignUpPage from '@/app/auth/signup/page';
import { login } from '@/app/auth/signin/_lib/signin.actions';
import { signup } from '@/app/auth/signup/_lib/singUp.actions';


// --- Mocks ---
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
    SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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

jest.mock('@/app/auth/signup/_lib/singUp.actions', () => ({
    signup: jest.fn(),
}));

jest.mock('@/src/lib/utils.client', () => ({
    ...jest.requireActual('@/src/lib/utils.client'),
    redirectByRole: jest.fn(),
}));


// --- Test Variables ---
const mockUseRouter = useRouter as jest.Mock;
const mockLogin = login as jest.Mock;
const mockSignup = signup as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;

describe('Authentication Integration Flow', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should allow a user to sign in successfully', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ success: true });
    
    render(<SignInPage />);

    // 1. User fills out the form
    await user.type(screen.getByLabelText(/email/i), 'testuser@example.com');
    await user.type(screen.getByPlaceholderText('Ingresa tu contraseña'), 'password123');

    // 2. User clicks the submit button
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);

    // 3. Verify loading state and action call
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(mockLogin).toHaveBeenCalledTimes(1);
    });

    // 4. Verify success feedback
    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith('¡Bienvenido de nuevo!');
    });
  });

  it('should allow a user to sign up and be redirected', async () => {
    const user = userEvent.setup();
    const router = { push: jest.fn() };
    mockUseRouter.mockReturnValue(router);
    mockSignup.mockResolvedValue({ success: true, message: '¡Registro exitoso!' });

    render(<SignUpPage />);

    // 1. User fills out the form
    await user.type(screen.getByLabelText(/nombre/i), 'New User');
    await user.type(screen.getByLabelText(/email/i), 'newuser@example.com');
    await user.type(screen.getByPlaceholderText('Ingresa tu contraseña'), 'Password123!');
    
    // 2. Accepts terms and submits
    await user.click(screen.getByLabelText(/acepto los/i));
    const submitButton = screen.getByRole('button', { name: /registrarse/i });
    await user.click(submitButton);

    // 3. Verify loading state and action call
    await waitFor(() => {
        expect(submitButton).toBeDisabled();
        expect(mockSignup).toHaveBeenCalledTimes(1);
    });

    // 4. Verify success feedback and redirection
    await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith('¡Registro exitoso!');
        expect(router.push).toHaveBeenCalledWith('/auth/signin');
    });
  });
});
