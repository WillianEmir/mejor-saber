import prisma from '@/src/lib/prisma';
import { createOrUpdateEvidencia, deleteEviencia } from '../evidencia.actions';
import { revalidatePath } from 'next/cache';

// Mock de 'next/cache'
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Evidencia Server Actions', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createOrUpdateEvidencia', () => {
    const afirmacionId = 'afirm-1';
    const areaId = 'area-1';

    it('should create an evidencia successfully when no id is provided', async () => {
      const formData = new FormData();
      formData.append('nombre', 'Nueva Evidencia');
      formData.append('afirmacionId', afirmacionId);
      
      jest.spyOn(prisma.evidencia, 'create').mockResolvedValue({ id: 'evid-1', nombre: 'Nueva Evidencia', afirmacionId });
      // Mock para la llamada anidada para obtener el areaId
      jest.spyOn(prisma.afirmacion, 'findUnique').mockResolvedValue({ 
        id: afirmacionId, 
        nombre: 'Afirm', 
        competenciaId: 'comp-1',
        competencia: { areaId: areaId, id: 'comp-1', nombre: 'Comp' } 
      } as any);

      const result = await createOrUpdateEvidencia(formData);

      expect(prisma.evidencia.create).toHaveBeenCalledWith({ data: { nombre: 'Nueva Evidencia', afirmacionId } });
      expect(prisma.afirmacion.findUnique).toHaveBeenCalledWith({ 
        where: { id: afirmacionId },
        select: { competencia: { select: { areaId: true } } },
      });
      expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/admin/areas/${areaId}`);
      expect(result).toEqual({ success: true, message: 'Evidencia creada exitosamente.' });
    });

    it('should update an evidencia successfully when id is provided', async () => {
      const formData = new FormData();
      formData.append('id', 'evid-1');
      formData.append('nombre', 'Evidencia Actualizada');
      formData.append('afirmacionId', afirmacionId);

      jest.spyOn(prisma.evidencia, 'update').mockResolvedValue({ id: 'evid-1', nombre: 'Evidencia Actualizada', afirmacionId });
      jest.spyOn(prisma.afirmacion, 'findUnique').mockResolvedValue({ 
        id: afirmacionId, 
        nombre: 'Afirm', 
        competenciaId: 'comp-1',
        competencia: { areaId: areaId, id: 'comp-1', nombre: 'Comp' } 
      } as any);

      const result = await createOrUpdateEvidencia(formData);

      expect(prisma.evidencia.update).toHaveBeenCalledWith({ where: { id: 'evid-1' }, data: { nombre: 'Evidencia Actualizada', afirmacionId } });
      expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/admin/areas/${areaId}`);
      expect(result).toEqual({ success: true, message: 'Evidencia actualizada exitosamente.' });
    });

    it('should return validation error for invalid data', async () => {
      const formData = new FormData(); // FormData vacía
      const result = await createOrUpdateEvidencia(formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Error de validación');
    });
  });

  describe('deleteEviencia', () => {
    const areaId = 'area-1';
    const evidenciaId = 'evid-1';

    it('should delete an evidencia successfully', async () => {
      jest.spyOn(prisma.evidencia, 'delete').mockResolvedValue({ id: evidenciaId, nombre: 'A Borrar', afirmacionId: 'afirm-1' });

      const result = await deleteEviencia(evidenciaId, areaId);

      expect(prisma.evidencia.delete).toHaveBeenCalledWith({ where: { id: evidenciaId } });
      expect(revalidatePath).toHaveBeenCalledWith(`/dashboard/admin/areas/${areaId}`);
      expect(result).toEqual({ success: true, message: 'Evidencia eliminada exitosamente.' });
    });

    it('should return an error if deletion fails', async () => {
      const errorMessage = 'Fallo al eliminar';
      jest.spyOn(prisma.evidencia, 'delete').mockRejectedValue(new Error(errorMessage));

      const result = await deleteEviencia(evidenciaId, areaId);
      
      expect(result.success).toBe(false);
      expect(result.message).toBe(errorMessage);
    });
  });
});
