import { render, screen, fireEvent } from '@testing-library/react';
import AfirmacionItem from '../afirmacion/AfirmacionItem';
import { AfirmacionWithEvidenciasType } from '@/app/dashboard/admin/areas/_lib/afirmacion.schema';

// Mock de dependencias
jest.mock('lucide-react', () => ({
  ChevronDown: () => <svg />,
  Plus: () => <svg />,
}));

jest.mock('@radix-ui/react-accordion', () => ({
  Header: ({ children }: any) => <header>{children}</header>,
  Trigger: ({ children }: any) => <button>{children}</button>,
}));

jest.mock('@/src/components/ui/accordion', () => ({
  AccordionItem: ({ children }: any) => <div>{children}</div>,
  AccordionContent: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/src/components/ui/Button', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}));

jest.mock('../evidencia/EvidenciaItem', () => ({
  __esModule: true,
  default: ({ evidencia }: any) => <div data-testid="evidencia-item">{evidencia.nombre}</div>,
}));

jest.mock('../evidencia/EvidenciaModal', () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div data-testid="evidencia-modal">Evidencia Modal</div> : null,
}));

jest.mock('@/src/components/ui/ItemActionMenu', () => ({
  __esModule: true,
  default: ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
    <div>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  ),
}));

describe('AfirmacionItem Component', () => {
  const mockOnEditAfirmacion = jest.fn();
  const mockOnDeleteAfirmacion = jest.fn();
  const mockOnDeleteEvidencia = jest.fn();

  const mockAfirmacion: AfirmacionWithEvidenciasType = {
    id: 'afirm-1',
    nombre: 'Afirmacion de Prueba',
    competenciaId: 'comp-1',
    evidencias: [
      { id: 'evid-1', nombre: 'Evidencia 1', afirmacionId: 'afirm-1' },
    ],
  };

  const mockAfirmacionSinEvidencias: AfirmacionWithEvidenciasType = {
    ...mockAfirmacion,
    evidencias: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the afirmacion name and its evidencias', () => {
    render(
      <AfirmacionItem
        afirmacion={mockAfirmacion}
        onEditAfirmacion={mockOnEditAfirmacion}
        onDeleteAfirmacion={mockOnDeleteAfirmacion}
        onDeleteEvidencia={mockOnDeleteEvidencia}
      />
    );
    expect(screen.getByText('Afirmacion de Prueba')).toBeInTheDocument();
    expect(screen.getByTestId('evidencia-item')).toBeInTheDocument();
    expect(screen.getByText('Evidencia 1')).toBeInTheDocument();
    expect(screen.queryByText('No hay evidencias para esta afirmación.')).not.toBeInTheDocument();
  });

  it('should render empty state message when there are no evidencias', () => {
    render(<AfirmacionItem afirmacion={mockAfirmacionSinEvidencias} onEditAfirmacion={mockOnEditAfirmacion} onDeleteAfirmacion={mockOnDeleteAfirmacion} onDeleteEvidencia={mockOnDeleteEvidencia} />);
    expect(screen.getByText('No hay evidencias para esta afirmación.')).toBeInTheDocument();
  });

  it('should call onEditAfirmacion when edit button is clicked', () => {
    render(<AfirmacionItem afirmacion={mockAfirmacion} onEditAfirmacion={mockOnEditAfirmacion} onDeleteAfirmacion={mockOnDeleteAfirmacion} onDeleteEvidencia={mockOnDeleteEvidencia} />);
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    expect(mockOnEditAfirmacion).toHaveBeenCalledWith(mockAfirmacion);
  });

  it('should call onDeleteAfirmacion when delete button is clicked', () => {
    render(<AfirmacionItem afirmacion={mockAfirmacion} onEditAfirmacion={mockOnEditAfirmacion} onDeleteAfirmacion={mockOnDeleteAfirmacion} onDeleteEvidencia={mockOnDeleteEvidencia} />);
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    expect(mockOnDeleteAfirmacion).toHaveBeenCalledWith(mockAfirmacion.id);
  });

  it('should open EvidenciaModal when "Añadir Evidencia" is clicked', () => {
    render(<AfirmacionItem afirmacion={mockAfirmacion} onEditAfirmacion={mockOnEditAfirmacion} onDeleteAfirmacion={mockOnDeleteAfirmacion} onDeleteEvidencia={mockOnDeleteEvidencia} />);
    expect(screen.queryByTestId('evidencia-modal')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Añadir Evidencia/i }));
    expect(screen.getByTestId('evidencia-modal')).toBeInTheDocument();
  });
});
