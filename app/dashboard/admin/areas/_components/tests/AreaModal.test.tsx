import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AreaModal from '../area/AreaModal';
import { createOrUpdateArea } from '@/app/dashboard/admin/areas/_lib/area.actions';
import { toast } from 'sonner';
import { Areatype } from '../../_lib/area.schema';

// --- MOCKS NECESARIOS ---

// 1. Server Actions (Mantener el fix anterior)
jest.mock('@/app/dashboard/admin/areas/_lib/area.actions', () => ({
  createOrUpdateArea: jest.fn(),
}));

// 2. Utilidades externas
jest.mock('sonner');
jest.mock('@heroicons/react/24/outline', () => ({
  PlusCircleIcon: () => <div />,
  PencilIcon: () => <div />,
}));

// 3. UI Components: Mantenemos Dialog porque usa Portals y es complejo
jest.mock('@/src/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div>{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <header>{children}</header>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogFooter: ({ children }: any) => <footer>{children}</footer>,
}));

// --- MOCKS ELIMINADOS ---
// Elimina los mocks de Form, Input y Button. 
// Queremos que usen la implementación REAL para que react-hook-form funcione.
/* jest.mock('@/src/components/ui/form'...  <-- BORRAR
   jest.mock('@/src/components/ui/input'... <-- BORRAR
   jest.mock('@/src/components/ui/Button'... <-- BORRAR
*/

const mockCreateOrUpdateArea = createOrUpdateArea as jest.Mock;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('AreaModal Component', () => {
  const mockOnClose = jest.fn();

  // Es buena práctica añadir un mock de ResizeObserver para componentes de UI modernos
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() { }
      unobserve() { }
      disconnect() { }
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render in "Create" mode with empty form', () => {
    render(<AreaModal isOpen={true} onClose={mockOnClose} />);

    // Al usar componentes reales, a veces el label no es un "heading", 
    // pero tu mock de DialogTitle usa <h2>, así que esto debería funcionar.
    expect(screen.getByRole('heading', { name: /Agregar Nueva Área/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: Ciencias Sociales')).toHaveValue('');
    expect(screen.getByRole('button', { name: /Crear Área/i })).toBeInTheDocument();
  });

  it('should submit form and call createOrUpdateArea for a new area', async () => {
    mockCreateOrUpdateArea.mockResolvedValue({ success: true, message: 'Creada!' });
    render(<AreaModal isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText('Ej: Ciencias Sociales');
    const submitButton = screen.getByRole('button', { name: /Crear Área/i });

    // Ahora, al no tener mocks, este cambio actualizará el estado interno real
    fireEvent.change(input, { target: { value: 'Nueva Area de Test' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateOrUpdateArea).toHaveBeenCalledTimes(1);
      const formData: FormData = mockCreateOrUpdateArea.mock.calls[0][0];
      expect(formData.get('nombre')).toBe('Nueva Area de Test');
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith('Creada!');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  // ... Resto de tests (Existing area, error handling) igual que antes
  it('should submit form and call createOrUpdateArea for an existing area', async () => {
    const mockArea: Areatype = { id: 'area-1', nombre: 'Ciencias', descripcionCorta: 'desc', descripcionLarga: 'desc', imagen: 'img.jpg' };
    mockCreateOrUpdateArea.mockResolvedValue({ success: true, message: 'Actualizada!' });
    render(<AreaModal isOpen={true} onClose={mockOnClose} area={mockArea} />);

    const input = screen.getByPlaceholderText('Ej: Ciencias Sociales');
    // Nota: verifica que el value inicial sea correcto
    expect(input).toHaveValue('Ciencias');

    const submitButton = screen.getByRole('button', { name: /Guardar Cambios/i });

    fireEvent.change(input, { target: { value: 'Ciencias Actualizadas' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateOrUpdateArea).toHaveBeenCalledTimes(1);
      const formData: FormData = mockCreateOrUpdateArea.mock.calls[0][0];
      expect(formData.get('nombre')).toBe('Ciencias Actualizadas');
      expect(formData.get('id')).toBe('area-1');
    });
  });

  it('should show error toast and not close if action fails', async () => {
    mockCreateOrUpdateArea.mockResolvedValue({ success: false, message: 'Error!' });
    render(<AreaModal isOpen={true} onClose={mockOnClose} />);

    const input = screen.getByPlaceholderText('Ej: Ciencias Sociales'); // Necesitamos llenar el form para que sea válido
    fireEvent.change(input, { target: { value: 'Area Valida' } });

    const submitButton = screen.getByRole('button', { name: /Crear Área/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateOrUpdateArea).toHaveBeenCalledTimes(1);
      expect(mockToast.error).toHaveBeenCalledWith('Error!');
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});