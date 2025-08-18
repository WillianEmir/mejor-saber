import 'server-only';

// En una aplicación real, estos tipos probablemente vendrían de tu ORM (Prisma, Drizzle, etc.)
type Area = { id: string; nombre: string; };
type Competencia = { id: string; nombre: string; areaId: string; };
type Afirmacion = { id: string; nombre: string; competenciaId: string; };
type Evidencia = { id: string; nombre: string; afirmacionId: string; };

// --- Datos de ejemplo para simular la base de datos ---
const areas: Area[] = [
  { id: 'area-1', nombre: 'Matemáticas' },
  { id: 'area-2', nombre: 'Lectura Crítica' },
];
const competencias: Competencia[] = [
  { id: 'comp-1', nombre: 'Interpretación y representación', areaId: 'area-1' },
  { id: 'comp-2', nombre: 'Formulación y ejecución', areaId: 'area-1' },
  { id: 'comp-3', nombre: 'Identificar y entender los contenidos locales que conforman un texto', areaId: 'area-2' },
];
const afirmaciones: Afirmacion[] = [
  { id: 'afir-1', nombre: 'Comprende y transforma la información cuantitativa...', competenciaId: 'comp-1' },
  { id: 'afir-2', nombre: 'Plantea e implementa estrategias que lleven a soluciones adecuadas.', competenciaId: 'comp-2' },
];
const evidencias: Evidencia[] = [
  { id: 'evid-1', nombre: 'Da cuenta de las características básicas de la información...', afirmacionId: 'afir-1' },
  { id: 'evid-2', nombre: 'Transforma la representación de una o más piezas de información.', afirmacionId: 'afir-1' },
];
// --- Fin de Datos ---

/**
 * Obtiene la estructura académica completa desde la base de datos.
 * @returns Un objeto con todas las áreas, competencias, afirmaciones y evidencias.
 */
export async function getFullAcademicStructure() {
  // Simula un retardo de la base de datos para emular una llamada asíncrona
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    areas,
    competencias,
    afirmaciones,
    evidencias,
  };
}

