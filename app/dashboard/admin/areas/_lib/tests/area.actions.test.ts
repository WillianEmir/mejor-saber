import prisma from '@/src/lib/prisma';
import { createOrUpdateArea, deleteArea } from '../area.actions';
import { revalidatePath } from 'next/cache';

// Mock de 'next/cache'
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Area Server Actions', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createOrUpdateArea', () => {
    it('should create an area successfully when no id is provided', async () => {
      const formData = new FormData();
      formData.append('nombre', 'Nueva Area');
      
      const createSpy = jest.spyOn(prisma.area, 'create').mockResolvedValue({ id: '1', nombre: 'Nueva Area', descripcionCorta: null, descripcionLarga: null, imagen: null, createdAt: new Date(), updatedAt: new Date() });

      const result = await createOrUpdateArea(formData); 

      expect(createSpy).toHaveBeenCalledWith({ data: { nombre: 'Nueva Area' } });
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/admin/areas');
      expect(result).toEqual({ message: 'Área creada exitosamente.' });
    });

    it('should update an area successfully when id is provided', async () => {
      const formData = new FormData();
      formData.append('id', '3a83f1cc-5bf9-400c-9d3e-dae69facf0aa');
      formData.append('nombre', 'Area Actualizada');
      
      const updateSpy = jest.spyOn(prisma.area, 'update').mockResolvedValue({ id: '3a83f1cc-5bf9-400c-9d3e-dae69facf0aa', nombre: 'Area Actualizada', descripcionCorta: null, descripcionLarga: null, imagen: null, createdAt: new Date(), updatedAt: new Date() });

      const result = await createOrUpdateArea(formData);

      expect(updateSpy).toHaveBeenCalledWith({ where: { id: '3a83f1cc-5bf9-400c-9d3e-dae69facf0aa' }, data: { nombre: 'Area Actualizada' } });
      expect(revalidatePath).toHaveBeenCalledWith('/dashboard/admin/areas');
      expect(result).toEqual({ message: 'Área actualizada exitosamente.' });
    });

    it('should return validation error for invalid data', async () => {
      const formData = new FormData();
      formData.append('nombre', ''); // Nombre vacío para forzar error de validación

      const result = await createOrUpdateArea(formData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Error de validación');
      expect(result.errors).toBeDefined();
    });

    it('should return error for unique constraint violation', async () => {
        const formData = new FormData();
        formData.append('nombre', 'Area Existente');

        const error = new Error('Unique constraint failed');
        jest.spyOn(prisma.area, 'create').mockRejectedValue(error);

        const result = await createOrUpdateArea(formData);

        expect(result.success).toBe(false);
        expect(result.message).toContain('Ya existe un área con este nombre');
    });

    it('should return generic database error on other failures', async () => {
        const formData = new FormData();
        formData.append('nombre', 'Area con Fallo');

        jest.spyOn(prisma.area, 'create').mockRejectedValue(new Error('Generic DB Error'));

        const result = await createOrUpdateArea(formData);

        expect(result.success).toBe(false);
        expect(result.message).toContain('No se pudo procesar la solicitud');
    });
  });

  describe('deleteArea', () => {
    it('should delete an area successfully', async () => {
      const deleteSpy = jest.spyOn(prisma.area, 'delete').mockResolvedValue({ id: 'area-1', nombre: 'Area a Borrar', descripcionCorta: null, descripcionLarga: null, imagen: null, createdAt: new Date(), updatedAt: new Date() });

      const result = await deleteArea('area-1');

      expect(deleteSpy).toHaveBeenCalledWith({ where: { id: 'area-1' } });
      expect(result).toEqual({ success: true, message: 'Área eliminada exitosamente.' });
    });

    it('should return an error if deletion fails', async () => {
      const errorMessage = 'Fallo al eliminar';
      jest.spyOn(prisma.area, 'delete').mockRejectedValue(new Error(errorMessage));

      const result = await deleteArea('area-1');
      
      expect(result.success).toBe(false);
      expect(result.message).toBe(errorMessage);
    });
  });
});
