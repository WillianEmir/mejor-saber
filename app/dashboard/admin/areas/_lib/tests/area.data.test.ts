import prisma from '@/src/lib/prisma';
import { getAreas, getAreaWithRelationsById } from '../area.data';

describe('Area Data Functions with jest.spyOn', () => {

  // Después de cada prueba, restauramos todos los mocks para asegurar que las pruebas estén aisladas.
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAreas', () => {
    it('should return an array of areas when successful', async () => {
      const mockAreas = [
        { id: '1', nombre: 'Area 1', descripcionCorta: 'Desc 1', descripcionLarga: 'Larga 1', imagen: 'img1.jpg' },
        { id: '2', nombre: 'Area 2', descripcionCorta: 'Desc 2', descripcionLarga: 'Larga 2', imagen: 'img2.jpg' },
      ];

      // Creamos un espía en 'prisma.area.findMany' y definimos su valor resuelto para este test.
      const findManySpy = jest.spyOn(prisma.area, 'findMany').mockResolvedValue(mockAreas as any);

      const areas = await getAreas();

      expect(areas).toEqual(mockAreas);
      expect(findManySpy).toHaveBeenCalledTimes(1);
      expect(findManySpy).toHaveBeenCalledWith({
        select: {
          id: true,
          nombre: true,
          descripcionCorta: true,
          descripcionLarga: true,
          imagen: true
        },
        orderBy: { nombre: 'asc' },
      });
    });

    it('should return an empty array if no areas are found', async () => {
      const findManySpy = jest.spyOn(prisma.area, 'findMany').mockResolvedValue([]);

      const areas = await getAreas();

      expect(areas).toEqual([]);
      expect(findManySpy).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if prisma.area.findMany fails', async () => {
      const errorMessage = 'Error de base de datos simulado';
      const findManySpy = jest.spyOn(prisma.area, 'findMany').mockRejectedValue(new Error(errorMessage));

      await expect(getAreas()).rejects.toThrow('Error de base de datos: No se pudieron obtener las áreas.');
      expect(findManySpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAreaWithRelationsById', () => {
    it('should return an area with relations when a valid ID is provided', async () => {
      const mockAreaWithRelations = {
        id: '1',
        nombre: 'Area 1',
        descripcionCorta: 'Desc 1',
        descripcionLarga: 'Larga 1',
        imagen: 'img1.jpg',
        competencias: [{ id: 'comp1', nombre: 'Comp 1', afirmaciones: [] }],
        contenidosCurriculares: [{ id: 'cont1', nombre: 'Cont 1' }],
      };
      const findUniqueSpy = jest.spyOn(prisma.area, 'findUnique').mockResolvedValue(mockAreaWithRelations as any);

      const area = await getAreaWithRelationsById('1');

      expect(area).toEqual(mockAreaWithRelations);
      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          competencias: {
            include: {
              afirmaciones: {
                include: {
                  evidencias: true,
                },
              },
            },
          },
          contenidosCurriculares: true,
        },
      });
    });

    it('should return null if no area is found for the given ID', async () => {
      const findUniqueSpy = jest.spyOn(prisma.area, 'findUnique').mockResolvedValue(null);

      const area = await getAreaWithRelationsById('non-existent-id');

      expect(area).toBeNull();
      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
    });



    it('should throw an error if prisma.area.findUnique fails', async () => {
      const errorMessage = 'Error de base de datos simulado';
      const findUniqueSpy = jest.spyOn(prisma.area, 'findUnique').mockRejectedValue(new Error(errorMessage));

      await expect(getAreaWithRelationsById('1')).rejects.toThrow('No se pudo obtener el área con sus relaciones.');
      expect(findUniqueSpy).toHaveBeenCalledTimes(1);
    });
  });
});