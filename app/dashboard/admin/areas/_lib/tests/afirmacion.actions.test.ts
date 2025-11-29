import prisma from '@/src/lib/prisma';
import { createOrUpdateAfirmacion, deleteAfirmacion } from '../afirmacion.actions';
import { revalidatePath } from 'next/cache';

// Mock de 'next/cache'
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Afirmacion Server Actions', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createOrUpdateAfirmacion', () => {
    const competenciaId = 'comp-1';
    const areaId = 'area-1';

    it('should create an afirmacion successfully when no id is provided', async () => {
      const formData = new FormData();
      formData.append('nombre', 'Nueva Afirmacion');
      formData.append('competenciaId', competenciaId);
      
      jest.spyOn(prisma.afirmacion, 'create').mockResolvedValue({ id: 'afirm-1', nombre: 'Nueva Afirmacion', competenciaId });
      jest.spyOn(prisma.competencia, 'findUnique').mockResolvedValue({ id: competenciaId, areaId, nombre: 'Comp' });

      const result = await createOrUpdateAfirmacion(formData);

      expect(prisma.afirmacion.create).toHaveBeenCalledWith({ data: { nombre: 'Nueva Afirmacion', competenciaId } });
      expect(prisma.competencia.findUnique).toHaveBeenCalledWith({ where: { id: competenciaId }, select: { areaId: true } });
      expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/admin/areas/${areaId}`);
      expect(result).toEqual({ success: true, message: 'Afirmación creada exitosamente.' });
    });

    it('should update an afirmacion successfully when id is provided', async () => {
      const formData = new FormData();
      formData.append('id', 'afirm-1');
      formData.append('nombre', 'Afirmacion Actualizada');
      formData.append('competenciaId', competenciaId);

      jest.spyOn(prisma.afirmacion, 'update').mockResolvedValue({ id: 'afirm-1', nombre: 'Afirmacion Actualizada', competenciaId });
      jest.spyOn(prisma.competencia, 'findUnique').mockResolvedValue({ id: competenciaId, areaId, nombre: 'Comp' });

      const result = await createOrUpdateAfirmacion(formData);

      expect(prisma.afirmacion.update).toHaveBeenCalledWith({ where: { id: 'afirm-1' }, data: { nombre: 'Afirmacion Actualizada', competenciaId } });
      expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/admin/areas/${areaId}`);
      expect(result).toEqual({ success: true, message: 'Afirmación actualizada exitosamente.' });
    });

    it('should return validation error for invalid data', async () => {
      const formData = new FormData(); // FormData vacía
      const result = await createOrUpdateAfirmacion(formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Error de validación');
    });
  });

  describe('deleteAfirmacion', () => {
    const areaId = 'area-1';
    const afirmacionId = 'afirm-1';

    it('should delete an afirmacion successfully', async () => {
      jest.spyOn(prisma.afirmacion, 'delete').mockResolvedValue({ id: afirmacionId, nombre: 'A Borrar', competenciaId: 'comp-1' });

      const result = await deleteAfirmacion(afirmacionId, areaId);

      expect(prisma.afirmacion.delete).toHaveBeenCalledWith({ where: { id: afirmacionId } });
      expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/admin/areas/${areaId}`);
      expect(result).toEqual({ success: true, message: 'Afirmación eliminada exitosamente.' });
    });

    it('should return an error if deletion fails', async () => {
      const errorMessage = 'Fallo al eliminar';
      jest.spyOn(prisma.afirmacion, 'delete').mockRejectedValue(new Error(errorMessage));

      const result = await deleteAfirmacion(afirmacionId, areaId);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe(errorMessage);
    });
  });
});
