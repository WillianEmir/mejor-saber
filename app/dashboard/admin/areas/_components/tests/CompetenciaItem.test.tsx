import { render, screen, fireEvent } from '@testing-library/react';
import CompetenciaItem from '../competencia/CompetenciaItem';
import { CompetenciaWithRelationsType } from '@/app/dashboard/admin/areas/_lib/competencia.schema';

// Mock de todas las dependencias de UI y de iconos
jest.mock('lucide-react', () => ({
  ChevronDown: () => <svg data-testid="chevron-down" />,
  Plus: () => <svg data-testid="plus-icon" />,
}));

// Mock de los primitivos de Radix y componentes UI personalizados
jest.mock('@radix-ui/react-accordion', () => ({
  Header: ({ children, className }: any) => <header className={className}>{children}</header>,
  Trigger: ({ children, className }: any) => <button className={className}>{children}</button>,
  Root: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

jest.mock('@/src/components/ui/accordion', () => ({
  AccordionItem: ({ children, value, className }: any) => <div data-testid="accordion-item" data-value={value} className={className}>{children}</div>,
  AccordionContent: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

jest.mock('@/src/components/ui/Button', () => ({
  Button: ({ children, onClick, ...props }: any) => <button onClick={onClick} {...props}>{children}</button>,
}));

jest.mock('../afirmacion/AfirmacionItem', () => ({
  __esModule: true,
  default: ({ afirmacion }: any) => <div data-testid="afirmacion-item">{afirmacion.nombre}</div>,
}));

jest.mock('../afirmacion/AfirmacionModal', () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div data-testid="afirmacion-modal">Afirmacion Modal</div> : null,
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

describe('CompetenciaItem Component', () => {
  const mockOnEditCompetencia = jest.fn();
  const mockOnDeleteCompetencia = jest.fn();
  const mockOnDeleteAfirmacion = jest.fn();
  const mockOnDeleteEvidencia = jest.fn();

  const mockCompetencia: CompetenciaWithRelationsType = {
    id: 'comp-1',
    nombre: 'Competencia de Prueba',
    areaId: 'area-1',
    afirmaciones: [
      { id: 'afirm-1', nombre: 'Afirmacion 1', competenciaId: 'comp-1', evidencias: [] },
    ],
  };

  const mockCompetenciaSinAfirmaciones: CompetenciaWithRelationsType = {
    ...mockCompetencia,
    afirmaciones: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the competencia name and its afirmaciones', () => {
    render(
      <CompetenciaItem
        competencia={mockCompetencia}
        onEditCompetencia={mockOnEditCompetencia}
        onDeleteCompetencia={mockOnDeleteCompetencia}
        onDeleteAfirmacion={mockOnDeleteAfirmacion}
        onDeleteEvidencia={mockOnDeleteEvidencia}
      />
    );
    expect(screen.getByText('Competencia de Prueba')).toBeInTheDocument();
    expect(screen.getByTestId('afirmacion-item')).toBeInTheDocument();
    expect(screen.getByText('Afirmacion 1')).toBeInTheDocument();
    expect(screen.queryByText('No hay afirmaciones para esta competencia.')).not.toBeInTheDocument();
  });

  it('should render the empty state message when there are no afirmaciones', () => {
    render(
        <CompetenciaItem
          competencia={mockCompetenciaSinAfirmaciones}
          onEditCompetencia={mockOnEditCompetencia}
          onDeleteCompetencia={mockOnDeleteCompetencia}
          onDeleteAfirmacion={mockOnDeleteAfirmacion}
          onDeleteEvidencia={mockOnDeleteEvidencia}
        />
      );
    expect(screen.getByText('No hay afirmaciones para esta competencia.')).toBeInTheDocument();
    expect(screen.queryByTestId('afirmacion-item')).not.toBeInTheDocument();
  });

  it('should call onEditCompetencia when the edit button is clicked', () => {
    render(<CompetenciaItem competencia={mockCompetencia} onEditCompetencia={mockOnEditCompetencia} onDeleteCompetencia={mockOnDeleteCompetencia} onDeleteAfirmacion={mockOnDeleteAfirmacion} onDeleteEvidencia={mockOnDeleteEvidencia} />);
    
    const editButton = screen.getByRole('button', { name: /Edit/i });
    fireEvent.click(editButton);

    expect(mockOnEditCompetencia).toHaveBeenCalledTimes(1);
    expect(mockOnEditCompetencia).toHaveBeenCalledWith(mockCompetencia);
  });

  it('should call onDeleteCompetencia when the delete button is clicked', () => {
    render(<CompetenciaItem competencia={mockCompetencia} onEditCompetencia={mockOnEditCompetencia} onDeleteCompetencia={mockOnDeleteCompetencia} onDeleteAfirmacion={mockOnDeleteAfirmacion} onDeleteEvidencia={mockOnDeleteEvidencia} />);
    
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(mockOnDeleteCompetencia).toHaveBeenCalledTimes(1);
    expect(mockOnDeleteCompetencia).toHaveBeenCalledWith(mockCompetencia.id);
  });

  it('should open the AfirmacionModal when "Añadir Afirmación" is clicked', () => {
    render(<CompetenciaItem competencia={mockCompetencia} onEditCompetencia={mockOnEditCompetencia} onDeleteCompetencia={mockOnDeleteCompetencia} onDeleteAfirmacion={mockOnDeleteAfirmacion} onDeleteEvidencia={mockOnDeleteEvidencia} />);
    
    expect(screen.queryByTestId('afirmacion-modal')).not.toBeInTheDocument();
    
    const addButton = screen.getByRole('button', { name: /Añadir Afirmación/i });
    fireEvent.click(addButton);

    expect(screen.getByTestId('afirmacion-modal')).toBeInTheDocument();
  });
});
