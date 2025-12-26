import { z } from 'zod';

const BarChartDataSchema = z.object({
  labels: z.array(z.string()),
  datasets: z.array(
    z.object({
      label: z.string(),
      data: z.array(z.number()),
      backgroundColor: z.union([z.string(), z.array(z.string())]),
      borderWidth: z.number().optional(),
      borderRadius: z.union([z.number(), z.array(z.number())]).optional(),
    })
  ),
});

const AreaAverageSchema = z.object({
  name: z.string(),
  first: z.number(),
  average: z.number(),
  last: z.number(),
});

const CompetenciaProgressSchema = z.object({
  name: z.string(),
  areaName: z.string(),
  first: z.number(),
  last: z.number(),
  average: z.number(),
});

const EvidenciaProgressSchema = z.object({
    name: z.string(),
    competenciaName: z.string(),
    areaName: z.string(),
    first: z.number(),
    last: z.number(),
    average: z.number(),
  });

const StudentExportDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastName: z.string(),
  degree: z.string(),
  sede: z.string(),
  simulationsTaken: z.number(),
  generalAverage: z.number(),
  initialOverallScore: z.number(),
  finalOverallScore: z.number(),
  areaAverages: z.array(AreaAverageSchema),
  competenciaAverages: z.array(CompetenciaProgressSchema),
  evidenciaAverages: z.array(EvidenciaProgressSchema),
});

const SummaryDataSchema = z.object({
    userName: z.string(),
    simulationsTaken: z.number(),
    generalAverage: z.number(),
    averageTimePerQuestion: z.number(),
    bestPerformingArea: z.object({ name: z.string(), average: z.number() }).nullable(),
    worstPerformingArea: z.object({ name: z.string(), average: z.number() }).nullable(),
    areaAverages: z.array(z.object({ name: z.string(), average: z.number() })),
    registeredUsers: z.number().optional(),
    maxUsers: z.number().nullish(),
  });
  
const NivelDesempenoDataSchema = z.object({
  areaName: z.string(),
  niveles: z.array(z.object({
    nivel: z.string(),
    studentCount: z.number(),
  })),
});

const NivelDesempenoDefinitionSchema = z.object({
    id: z.string(),
    descripcion: z.string(),
    puntajeMin: z.number(),
    puntajeMax: z.number(),
    nivel: z.string(),
    areaId: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    area: z.object({
        nombre: z.string(),
    }),
});

export const SchoolProgressSchema = z.object({
  summaryData: SummaryDataSchema,
  overallProgressData: BarChartDataSchema,
  areaProgressData: BarChartDataSchema,
  areaAverages: z.array(AreaAverageSchema),
  competenciaAverages: z.array(CompetenciaProgressSchema),
  evidenciaAverages: z.array(EvidenciaProgressSchema),
  studentExportData: z.array(StudentExportDataSchema),
  nivelesDesempenoData: z.array(NivelDesempenoDataSchema),
  nivelesDefiniciones: z.array(NivelDesempenoDefinitionSchema),
});

export type SchoolProgressData = z.infer<typeof SchoolProgressSchema>;
export type NivelDesempenoData = z.infer<typeof NivelDesempenoDataSchema>;
export type NivelDesempenoDefinition = z.infer<typeof NivelDesempenoDefinitionSchema>;
