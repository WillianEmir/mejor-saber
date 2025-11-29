import prisma from '@/src/lib/prisma';
import { createOrUpdateCompetencia, deleteCompetencia } from '../competencia.actions';
import { revalidatePath } from 'next/cache';

// Mock de 'next/cache'
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Competencia Server Actions', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createOrUpdateCompetencia', () => {
    const areaId = 'area-1';

    it('should create a competencia successfully when no id is provided', async () => {
      const formData = new FormData();
      formData.append('nombre', 'Nueva Competencia');
      formData.append('areaId', areaId);
      
      const createSpy = jest.spyOn(prisma.competencia, 'create').mockResolvedValue({ id: 'comp-1', nombre: 'Nueva Competencia', areaId });

      const result = await createOrUpdateCompetencia(formData);

      expect(createSpy).toHaveBeenCalledWith({ data: { nombre: 'Nueva Competencia', areaId } });
      expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/admin/areas/${areaId}`);
      expect(result).toEqual({ success: true, message: 'Competencia creada exitosamente.' });
    });

    it('should update a competencia successfully when id is provided', async () => {
      const formData = new FormData();
      formData.append('id', 'comp-1');
      formData.append('nombre', 'Competencia Actualizada');
      formData.append('areaId', areaId);

      const updateSpy = jest.spyOn(prisma.competencia, 'update').mockResolvedValue({ id: 'comp-1', nombre: 'Competencia Actualizada', areaId });

      const result = await createOrUpdateCompetencia(formData);

      expect(updateSpy).toHaveBeenCalledWith({ where: { id: 'comp-1' }, data: { nombre: 'Competencia Actualizada', areaId } });
      expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/admin/areas/${areaId}`);
      expect(result).toEqual({ success: true, message: 'Competencia actualizada exitosamente.' });
    });

    it('should return validation error for invalid data', async () => {
      const formData = new FormData();
      // No 'nombre' or 'areaId'
      const result = await createOrUpdateCompetencia(formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Error de validación');
      expect(result.errors).toBeDefined();
    });

    it('should return a generic error for unique constraint violation', async () => {
        const formData = new FormData();
        formData.append('nombre', 'Competencia Existente');
        formData.append('areaId', areaId);

        const error = new Error('Unique constraint failed');
        jest.spyOn(prisma.competencia, 'create').mockRejectedValue(error);

        const result = await createOrUpdateCompetencia(formData);

        expect(result.success).toBe(false);
        expect(result.message).toContain('Error en la base de datos.');
    });
  });

  describe('deleteCompetencia', () => {
    const areaId = 'area-1';
    const competenciaId = 'comp-1';

    it('should delete a competencia successfully', async () => {
      const deleteSpy = jest.spyOn(prisma.competencia, 'delete').mockResolvedValue({ id: competenciaId, nombre: 'A Borrar', areaId });

      const result = await deleteCompetencia(competenciaId, areaId);

      expect(deleteSpy).toHaveBeenCalledWith({ where: { id: competenciaId } });
      expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/admin/areas/${areaId}`);
      expect(result).toEqual({ success: true, message: 'Competencia eliminada exitosamente.' });
    });

    it('should return an error if deletion fails', async () => {
      const errorMessage = 'Fallo al eliminar';
      jest.spyOn(prisma.competencia, 'delete').mockRejectedValue(new Error(errorMessage));

      const result = await deleteCompetencia(competenciaId, areaId);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe(errorMessage);
    });
  });
});
