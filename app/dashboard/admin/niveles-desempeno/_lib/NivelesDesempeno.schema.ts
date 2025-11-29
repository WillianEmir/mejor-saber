import { NivelDesempeno } from '@/src/generated/prisma';
import * as z from 'zod';
import { Areatype } from '../../areas/_lib/area.schema';

enum Nivel {
  NIVEL1 = 'NIVEL1',
  NIVEL2 = 'NIVEL2',
  NIVEL3 = 'NIVEL3', 
  NIVEL4 = 'NIVEL4', 
}

export const NivelDesempenoSchema = z.object({
  id: z.string().optional(),
  nivel: z.enum(Nivel, { message: 'El nivel es requerido' }),
  descripcion: z.string().min(1, { message: 'La descripción es requerida' }),
  puntajeMin: z.coerce
    .number()
    .min(0, { message: 'El puntaje mínimo debe ser mayor o igual a 0' }),
  puntajeMax: z.coerce
    .number()
    .min(0, { message: 'El puntaje máximo debe ser mayor o igual a 0' }),
  areaId: z.string({ error: 'El ID del área es obligatorio.' }),
});

export type NivelDesempenoType = Omit<NivelDesempeno, 'createdAt' | 'updatedAt'> & {
  area: Areatype
}