import { render, screen, fireEvent } from '@testing-library/react';
import EvidenciaItem from '../evidencia/EvidenciaItem';
import { EvidenciaType } from '@/app/dashboard/admin/areas/_lib/evidencia.schema';

// Mock del ItemActionMenu
jest.mock('@/src/components/ui/ItemActionMenu', () => ({
  __esModule: true,
  default: ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
    <div>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Delete</button>
    </div>
  ),
}));

describe('EvidenciaItem Component', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const mockEvidencia: EvidenciaType = {
    id: 'evid-1',
    nombre: 'Evidencia de Prueba',
    afirmacionId: 'afirm-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the evidencia name', () => {
    render(
      <EvidenciaItem
        evidencia={mockEvidencia}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Evidencia de Prueba')).toBeInTheDocument();
  });

  it('should call onEdit with the evidencia object when the edit button is clicked', () => {
    render(
      <EvidenciaItem
        evidencia={mockEvidencia}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByRole('button', { name: /Edit/i });
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockEvidencia);
  });

  it('should call onDelete with the evidencia id when the delete button is clicked', () => {
    render(
      <EvidenciaItem
        evidencia={mockEvidencia}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockEvidencia.id);
  });
});
