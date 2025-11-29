import { Area, ContenidoCurricular, EjeTematico } from "@/src/generated/prisma";

// Definición de tipos para el material de repaso con progreso 
export type EjeTematicoConProgreso = EjeTematico & {
  progress?: number;
};

export type ContenidoCurricularConEjes = ContenidoCurricular & {
  ejesTematicos: EjeTematicoConProgreso[];
};

export type MaterialRepasoType = Area & {
  contenidosCurriculares: ContenidoCurricularConEjes[];
};