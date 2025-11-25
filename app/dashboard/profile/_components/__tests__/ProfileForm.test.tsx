import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileForm } from '../ProfileForm';
import { toast } from 'sonner';
import { updateUser } from '@/app/dashboard/profile/_lib/profile.actions';
import { UpdateProfileSchema } from '@/app/dashboard/profile/_lib/profile.schema';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

jest.mock('@/app/dashboard/profile/_lib/profile.actions', () => ({
  updateUser: jest.fn(),
}));

// Mock UpdateProfileSchema
jest.mock('@/app/dashboard/profile/_lib/profile.schema', () => ({
  UpdateProfileSchema: {
    safeParse: jest.fn(),
    omit: jest.fn(() => ({
      safeParse: jest.fn(),
    })),
  },
}));

// Mock Cloudinary CldUploadWidget
jest.mock('next-cloudinary', () => ({
    CldUploadWidget: ({ onSuccess, children }: any) => {
      const open = () => {
        // Simulate a successful upload
        onSuccess({ event: 'success', info: { secure_url: 'http://mocked.image.url/new.jpg' } });
      };
      return children({ open });
    },
}));

// Mock Avatar components
jest.mock('@/src/components/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div data-testid="mock-avatar">{children}</div>,
  AvatarImage: ({ src, alt }: { src: string, alt: string }) => <img src={src} alt={alt} data-testid="mock-avatar-image" />,
  AvatarFallback: ({ children }: any) => <span data-testid="mock-avatar-fallback">{children}</span>,
}));


const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockUpdateUser = updateUser as jest.Mock;
const mockUpdateProfileSchema = UpdateProfileSchema as any;


describe('ProfileForm', () => {
    const mockUser = {
        id: 'user123',
        idDocument: '123456789',
        name: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        department: 'SomeDept',
        city: 'SomeCity',
        phone: '1234567890',
        image: 'http://mocked.image.url/initial.jpg',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        // Default mock for schema validation (successful)
        mockUpdateProfileSchema.omit.mockReturnValue({
            safeParse: jest.fn().mockReturnValue({
                success: true,
                data: mockUser, // Return valid data by default
            }),
        });

        // Default mock for updateUser (successful)
        mockUpdateUser.mockResolvedValue({
            success: true,
            message: 'Perfil actualizado correctamente',
        });
    });

    it('should render the form with initial user data', () => {
        render(<ProfileForm user={mockUser} />);

        expect(screen.getByLabelText(/documento de identidad/i)).toHaveValue(mockUser.idDocument);
        expect(screen.getByLabelText(/nombre/i)).toHaveValue(mockUser.name);
        expect(screen.getByLabelText(/apellido/i)).toHaveValue(mockUser.lastName);
        expect(screen.getByLabelText(/dirección/i)).toHaveValue(mockUser.address);
        expect(screen.getByLabelText(/departamento/i)).toHaveValue(mockUser.department);
        expect(screen.getByLabelText(/ciudad/i)).toHaveValue(mockUser.city);
        expect(screen.getByLabelText(/teléfono/i)).toHaveValue(mockUser.phone);

        // Check for image
        expect(screen.getByRole('img', { name: /user image/i })).toHaveAttribute('src', mockUser.image);
        expect(screen.getByRole('button', { name: /cambiar imagen/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /actualizar perfil/i })).toBeInTheDocument();
    });

    it('should allow user to type in form fields', async () => {
        const user = userEvent.setup();
        render(<ProfileForm user={mockUser} />);

        const nameInput = screen.getByLabelText(/nombre/i);
        await user.clear(nameInput);
        await user.type(nameInput, 'Jane');
        expect(nameInput).toHaveValue('Jane');

        const phoneInput = screen.getByLabelText(/teléfono/i);
        await user.clear(phoneInput);
        await user.type(phoneInput, '0987654321');
        expect(phoneInput).toHaveValue('0987654321');
    });

    it('should handle successful profile update', async () => {
        const user = userEvent.setup();
        render(<ProfileForm user={mockUser} />);

        const nameInput = screen.getByLabelText(/nombre/i);
        await user.clear(nameInput);
        await user.type(nameInput, 'Jane');

        const submitButton = screen.getByRole('button', { name: /actualizar perfil/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockUpdateUser).toHaveBeenCalledTimes(1);
            expect(mockUpdateUser).toHaveBeenCalledWith({
                ...mockUser,
                name: 'Jane',
            });
        });

        await waitFor(() => {
            expect(mockToastSuccess).toHaveBeenCalledWith('Perfil actualizado correctamente');
        });
    });

    it('should handle failed profile update and show error toast', async () => {
        const user = userEvent.setup();
        mockUpdateUser.mockResolvedValueOnce({
            success: false,
            message: 'Error al actualizar el perfil',
        });

        render(<ProfileForm user={mockUser} />);

        const submitButton = screen.getByRole('button', { name: /actualizar perfil/i });
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockUpdateUser).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('Error al actualizar el perfil');
        });
    });

    it('should show validation errors for invalid input', async () => {
        const user = userEvent.setup();
        mockUpdateProfileSchema.omit.mockReturnValueOnce({
            safeParse: jest.fn().mockReturnValueOnce({
                success: false,
                error: {
                    issues: [{ message: 'El nombre es requerido', path: ['name'] }],
                    flatten: () => ({
                        fieldErrors: {
                            name: ['El nombre es requerido'],
                        },
                    }),
                },
            }),
        });

        render(<ProfileForm user={mockUser} />);

        const nameInput = screen.getByLabelText(/nombre/i);
        await user.clear(nameInput); // Make name empty to trigger validation

        const submitButton = screen.getByRole('button', { name: /actualizar perfil/i });
        await user.click(submitButton);

        expect(mockUpdateUser).not.toHaveBeenCalled();
        
        await waitFor(() => {
            expect(mockToastError).toHaveBeenCalledWith('El nombre es requerido');
        });

        await waitFor(() => {
            expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
        });
    });

    it('should update image state on successful cloudinary upload', async () => {
        const user = userEvent.setup();
        render(<ProfileForm user={mockUser} />);

        const changeImageButton = screen.getByRole('button', { name: /cambiar imagen/i });
        await user.click(changeImageButton);

        // After the click, the mocked CldUploadWidget will call onSuccess
        await waitFor(() => {
            expect(screen.getByRole('img', { name: /user image/i })).toHaveAttribute('src', 'http://mocked.image.url/new.jpg');
        });
    });
});
