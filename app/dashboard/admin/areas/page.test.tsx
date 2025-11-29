import { render, screen } from '@testing-library/react';
import Page from './page';
import { getAreas } from './_lib/area.data';
import { notFound } from 'next/navigation';

// Mock de las funciones
jest.mock('./_lib/area.data');
jest.mock('./_components/area/AreasList', () => {
  const MockAreasList = ({ areas }: { areas: any[] }) => (
    <div data-testid="areas-list">{areas.map(area => <span key={area.id}>{area.nombre}</span>)}</div>
  );
  MockAreasList.displayName = 'MockAreasList';
  return MockAreasList;
});
jest.mock('next/navigation', () => ({
  notFound: jest.fn(() => {
    // Simula el comportamiento real de notFound() que lanza un error.
    throw new Error('notFound() was called');
  }),
}));

const mockGetAreas = getAreas as jest.Mock;
const mockNotFound: jest.Mock<never, []> = notFound as jest.Mock<never, []>;

describe('Admin Areas Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render AreasList with fetched areas when getAreas returns data', async () => {
    const mockAreas = [
      { id: '1', nombre: 'Area 1', descripcionCorta: 'Desc 1', descripcionLarga: 'Larga 1', imagen: 'img1.jpg' },
      { id: '2', nombre: 'Area 2', descripcionCorta: 'Desc 2', descripcionLarga: 'Larga 2', imagen: 'img2.jpg' },
    ];
    mockGetAreas.mockResolvedValue(mockAreas);

    render(await Page());

    expect(mockGetAreas).toHaveBeenCalledTimes(1);
    const areasList = screen.getByTestId('areas-list');
    expect(areasList).toBeInTheDocument();
    expect(screen.getByText('Area 1')).toBeInTheDocument();
    expect(screen.getByText('Area 2')).toBeInTheDocument();
    expect(mockNotFound).not.toHaveBeenCalled();
  });

  it('should call notFound() when getAreas returns an empty array', async () => {
    mockGetAreas.mockResolvedValue([]);

    await expect(Page()).rejects.toThrow('notFound() was called');

    expect(mockGetAreas).toHaveBeenCalledTimes(1);
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });

  it('should call notFound() when getAreas returns null', async () => {
    mockGetAreas.mockResolvedValue(null);

    await expect(Page()).rejects.toThrow('notFound() was called');

    expect(mockGetAreas).toHaveBeenCalledTimes(1);
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });


  it('should call notFound() when getAreas throws an error', async () => {
    mockGetAreas.mockRejectedValue(new Error('Database error'));

    // next/navigation's notFound throws an error, so we expect the component to throw
    await expect(Page()).rejects.toThrow('notFound() was called');

    expect(mockGetAreas).toHaveBeenCalledTimes(1);
    expect(mockNotFound).toHaveBeenCalledTimes(1);
  });
});
