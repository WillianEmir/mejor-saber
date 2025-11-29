import { render, screen, fireEvent } from '@testing-library/react';
import AreaViewHeader from '../area/AreaViewHeader';

// Mock de dependencias
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: () => <svg />,
  Pencil: () => <svg />,
  Plus: () => <svg />,
  Trash2: () => <svg />,
}));

// Mock del componente Button para asegurar que los clicks y el estado disabled se manejen
jest.mock('@/src/components/ui/Button', () => ({
  Button: ({ children, onClick, variant, disabled }: { children: React.ReactNode; onClick: () => void; variant?: string; disabled?: boolean }) => (
    <button onClick={onClick} data-variant={variant} disabled={disabled}>
      {children}
    </button>
  ),
}));

describe('AreaViewHeader Component', () => {
  const mockOnAddCompetencia = jest.fn();
  const mockOnEditArea = jest.fn();
  const mockOnDeleteArea = jest.fn();
  const areaName = 'Área de Ciencias';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the area name and management message', () => {
    render(
      <AreaViewHeader
        areaName={areaName}
        onAddCompetencia={mockOnAddCompetencia}
        onEditArea={mockOnEditArea}
        onDeleteArea={mockOnDeleteArea}
        isPending={false}
      />
    );

    expect(screen.getByRole('heading', { name: areaName })).toBeInTheDocument();
    expect(screen.getByText('Gestiona las competencias, afirmaciones y evidencias de esta área.')).toBeInTheDocument();
  });

  it('should call onAddCompetencia when the "Agregar Competencia" button is clicked', () => {
    render(
      <AreaViewHeader
        areaName={areaName}
        onAddCompetencia={mockOnAddCompetencia}
        onEditArea={mockOnEditArea}
        onDeleteArea={mockOnDeleteArea}
        isPending={false}
      />
    );

    const addButton = screen.getByRole('button', { name: /Agregar Competencia/i });
    fireEvent.click(addButton);

    expect(mockOnAddCompetencia).toHaveBeenCalledTimes(1);
  });

  it('should call onEditArea when the "Editar Área" button is clicked', () => {
    render(
      <AreaViewHeader
        areaName={areaName}
        onAddCompetencia={mockOnAddCompetencia}
        onEditArea={mockOnEditArea}
        onDeleteArea={mockOnDeleteArea}
        isPending={false}
      />
    );

    const editButton = screen.getByRole('button', { name: /Editar Área/i });
    fireEvent.click(editButton);

    expect(mockOnEditArea).toHaveBeenCalledTimes(1);
  });

  it('should call onDeleteArea when the "Eliminar" button is clicked', () => {
    render(
      <AreaViewHeader
        areaName={areaName}
        onAddCompetencia={mockOnAddCompetencia}
        onEditArea={mockOnEditArea}
        onDeleteArea={mockOnDeleteArea}
        isPending={false}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /Eliminar/i });
    fireEvent.click(deleteButton);

    expect(mockOnDeleteArea).toHaveBeenCalledTimes(1);
});

it('should display "Creando..." on the add button when isPending is true', () => {
    render(
      <AreaViewHeader
        areaName={areaName}
        onAddCompetencia={mockOnAddCompetencia}
        onEditArea={mockOnEditArea}
        onDeleteArea={mockOnDeleteArea}
        isPending={true}
      />
    );
  
    const addButton = screen.getByRole('button', { name: /Creando.../i });
    expect(addButton).toBeInTheDocument();
  });

  it('should have a link to go back to the areas list', () => {
    render(
        <AreaViewHeader
          areaName={areaName}
          onAddCompetencia={mockOnAddCompetencia}
          onEditArea={mockOnEditArea}
          onDeleteArea={mockOnDeleteArea}
          isPending={false}
        />
      );

    const backLink = screen.getByRole('link', { name: /Volver a las Áreas/i });
    expect(backLink).toHaveAttribute('href', '/dashboard/admin/areas');
  });
});
