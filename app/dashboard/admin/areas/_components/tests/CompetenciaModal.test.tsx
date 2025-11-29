import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompetenciaModal from '../competencia/CompetenciaModal';
import { createOrUpdateCompetencia } from '@/app/dashboard/admin/areas/_lib/competencia.actions';
import { toast } from 'sonner';
import { CompetenciaType } from '../../_lib/competencia.schema';

// Mock de todas las dependencias
jest.mock('@/app/dashboard/admin/areas/_lib/competencia.actions');
jest.mock('sonner');
jest.mock('@heroicons/react/24/outline', () => ({
  PlusCircleIcon: () => <div />,
  PencilIcon: () => <div />,
}));

// Mock de componentes de UI
jest.mock('@/src/components/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => open ? <div>{children}</div> : null,
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <header>{children}</header>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
  DialogFooter: ({ children }: any) => <footer>{children}</footer>,
}));
jest.mock('@/src/components/ui/form', () => ({
  Form: ({ children }: any) => <form>{children}</form>,
  FormControl: ({ children }: any) => <div>{children}</div>,
  FormField: ({ render, name }: any) => render({ field: { name, value: '', onChange: jest.fn() } }),
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
}));
jest.mock('@/src/components/ui/input', () => ({
    Input: (props: any) => <input {...props} />,
}));
jest.mock('@/src/components/ui/Button', () => ({
  Button: ({ children, onClick, type, disabled }: any) => <button onClick={onClick} type={type} disabled={disabled}>{children}</button>,
}));

const mockCreateOrUpdateCompetencia = createOrUpdateCompetencia as jest.Mock;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('CompetenciaModal Component', () => {
  const mockOnClose = jest.fn();
  const areaId = 'area-1';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render in "Create" mode', () => {
    render(<CompetenciaModal isOpen={true} onClose={mockOnClose} areaId={areaId} competencia={null} />);

    expect(screen.getByRole('heading', { name: /Agregar Nueva Competencia/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ej: Pensamiento y sistemas geométricos')).toHaveValue('');
  });

  it('should render in "Edit" mode', () => {
    const mockCompetencia: CompetenciaType = { id: 'comp-1', nombre: 'Pensamiento Geométrico', areaId, descripcionCorta: 'desc corta', descripcionLarga: 'desc larga', imagen: 'img.jpg' };
    render(<CompetenciaModal isOpen={true} onClose={mockOnClose} areaId={areaId} competencia={mockCompetencia} />);

    expect(screen.getByRole('heading', { name: /Editar Competencia/i })).toBeInTheDocument();
  });

  it('should submit form to create a new competencia', async () => {
    mockCreateOrUpdateCompetencia.mockResolvedValue({ success: true, message: 'Creada!' });
    render(<CompetenciaModal isOpen={true} onClose={mockOnClose} areaId={areaId} competencia={null} />);

    const input = screen.getByPlaceholderText('Ej: Pensamiento y sistemas geométricos');
    const submitButton = screen.getByRole('button', { name: /Crear Competencia/i });

    fireEvent.change(input, { target: { value: 'Nueva Competencia de Test' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateOrUpdateCompetencia).toHaveBeenCalledTimes(1);
      const formData: FormData = mockCreateOrUpdateCompetencia.mock.calls[0][0];
      expect(formData.get('nombre')).toBe('Nueva Competencia de Test');
      expect(formData.get('areaId')).toBe(areaId);
      expect(formData.get('id')).toBeNull();
    });

    await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Creada!');
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should submit form to update an existing competencia', async () => {
    const mockCompetencia: CompetenciaType = { id: 'comp-1', nombre: 'Geometría', areaId, descripcionCorta: 'desc corta', descripcionLarga: 'desc larga', imagen: 'img.jpg' };
    mockCreateOrUpdateCompetencia.mockResolvedValue({ success: true, message: 'Actualizada!' });
    render(<CompetenciaModal isOpen={true} onClose={mockOnClose} areaId={areaId} competencia={mockCompetencia} />);

    const input = screen.getByPlaceholderText('Ej: Pensamiento y sistemas geométricos');
    const submitButton = screen.getByRole('button', { name: /Guardar Cambios/i });

    fireEvent.change(input, { target: { value: 'Geometría Analítica' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
        const formData: FormData = mockCreateOrUpdateCompetencia.mock.calls[0][0];
        expect(formData.get('nombre')).toBe('Geometría Analítica');
        expect(formData.get('id')).toBe('comp-1');
        expect(formData.get('areaId')).toBe(areaId);
    });
    
    await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith('Actualizada!');
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('should show error toast if action fails', async () => {
    mockCreateOrUpdateCompetencia.mockResolvedValue({ success: false, message: 'Error!' });
    render(<CompetenciaModal isOpen={true} onClose={mockOnClose} areaId={areaId} competencia={null} />);

    const submitButton = screen.getByRole('button', { name: /Crear Competencia/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateOrUpdateCompetencia).toHaveBeenCalledTimes(1);
      expect(mockToast.error).toHaveBeenCalledWith('Error!');
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
