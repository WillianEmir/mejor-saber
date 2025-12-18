import { notFound } from 'next/navigation';

import { getSimulacroByIdWithRelations, getSimulacroResult } from '../../_lib/simulacro.data';
import SimulacroResult from '../../_components/SimulacroResult';
import { CompetenciaWithAreaType } from '@/app/dashboard/admin/areas/_lib/competencia.schema';
import { SimulacroResultType } from '../../_lib/simulacro.schema';
import { Areatype } from '@/app/dashboard/admin/areas/_lib/area.schema';

interface SimulacroResultPageProps {
  params: Promise<{
    simulacroId: string;
  }>
}

type SimulacroDisplayResultType = {
  id: string;
  score: number;
  duracionMinutos: number;
  preguntas: SimulacroResultType[];
  area: Areatype | null;
  competencia: (CompetenciaWithAreaType & { area: Areatype }) | null;
}
 
export default async function SimulacroResultPage({ params }: SimulacroResultPageProps) {

  // Obtiene el Id del simulacro de la url
  const { simulacroId } = await params; // No need for await params, it's already an object
  if (!simulacroId) notFound();

  // Obtiene el simulacro completo con sus relaciones (competencia y área)
  const simulacroCompleto = await getSimulacroByIdWithRelations(simulacroId);
  if (!simulacroCompleto) notFound();

  // Obtiene los resultados detallados de las preguntas del simulacro
  const simulacroPreguntas = await getSimulacroResult(simulacroId);
  if (!simulacroPreguntas || simulacroPreguntas.length === 0) {
    // Si no hay preguntas, no podemos mostrar un resultado significativo
    notFound(); 
  }
 
  // Construye el objeto simulacroData que el componente SimulacroResult espera
  const simulacroData: SimulacroDisplayResultType = {
    id: simulacroCompleto.id,
    score: simulacroCompleto.score ?? 0,
    duracionMinutos: simulacroCompleto.duracionMinutos ?? 0,
    preguntas: simulacroPreguntas,
    area: simulacroCompleto.area,
    competencia: simulacroCompleto.competencia as (CompetenciaWithAreaType & { area: Areatype }) | null,
  };

  return <SimulacroResult simulacroData={simulacroData} />;
}