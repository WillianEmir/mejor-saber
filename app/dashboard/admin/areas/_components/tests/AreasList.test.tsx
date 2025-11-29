import { render, screen, fireEvent } from '@testing-library/react';
import AreasList from '../area/AreasList';
import { Areatype } from '../../_lib/area.schema';

// Mock de los componentes dependientes
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('@/src/components/ui/card', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h2 data-testid="card-title">{children}</h2>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
}));

jest.mock('../area/AreaModal', () => {
  return ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid="area-modal">
        <p>Area Modal Content</p>
        <button onClick={onClose}>Close Modal</button>
      </div>
    ) : null;
});

jest.mock('../area/AreaListHeader', () => {
  return ({ onAddArea }: { onAddArea: () => void }) => (
    <button data-testid="add-area-button" onClick={onAddArea}>Add Area</button>
  );
});

describe('AreasList', () => {
  const mockAreas: Areatype[] = [
    { id: '1', nombre: 'Area Uno', descripcionCorta: 'Desc Uno', descripcionLarga: 'Larga Uno', imagen: 'img1.jpg' },
    { id: '2', nombre: 'Area Dos', descripcionCorta: 'Desc Dos', descripcionLarga: 'Larga Dos', imagen: 'img2.jpg' },
  ];

  it('should render a list of areas when areas prop is provided', () => {
    render(<AreasList areas={mockAreas} />);

    expect(screen.getByText('Area Uno')).toBeInTheDocument();
    expect(screen.getByText('Area Dos')).toBeInTheDocument();
    expect(screen.getAllByTestId('card')).toHaveLength(mockAreas.length); // Check if cards are rendered
    expect(screen.queryByText('No hay áreas creadas todavía.')).not.toBeInTheDocument();
  });

  it('should display "No hay áreas creadas todavía." message when areas prop is empty', () => {
    render(<AreasList areas={[]} />);

    expect(screen.getByText('No hay áreas creadas todavía.')).toBeInTheDocument();
    expect(screen.getByText('¡Comienza agregando una nueva área!')).toBeInTheDocument();
    expect(screen.queryByText('Area Uno')).not.toBeInTheDocument();
  });

  it('should open AreaModal when onAddArea is called from AreaListHeader', () => {
    render(<AreasList areas={mockAreas} />);

    const addAreaButton = screen.getByTestId('add-area-button');
    fireEvent.click(addAreaButton);

    expect(screen.getByTestId('area-modal')).toBeInTheDocument();
  });

  it('should close AreaModal when onClose is called from AreaModal', () => {
    render(<AreasList areas={mockAreas} />);

    const addAreaButton = screen.getByTestId('add-area-button');
    fireEvent.click(addAreaButton); // Open modal

    expect(screen.getByTestId('area-modal')).toBeInTheDocument();

    const closeModalButton = screen.getByText('Close Modal');
    fireEvent.click(closeModalButton); // Close modal

    expect(screen.queryByTestId('area-modal')).not.toBeInTheDocument();
  });

  it('each area link should navigate to the correct href', () => {
    render(<AreasList areas={mockAreas} />);

    const areaOneLink = screen.getByRole('link', { name: /Area Uno/i });
    expect(areaOneLink).toHaveAttribute('href', '/dashboard/admin/areas/1');

    const areaTwoLink = screen.getByRole('link', { name: /Area Dos/i });
    expect(areaTwoLink).toHaveAttribute('href', '/dashboard/admin/areas/2');
  });
});
