
import { notFound } from 'next/navigation';

import { getSimulacroResult } from '../../_lib/simulacro.data';

import SimulacroResult from '../../_components/SimulacroResult';

interface SimulacroResultPageProps {
  params: Promise<{
    simulacroId: string;
  }>
}

export default async function SimulacroResultPage({ params }: SimulacroResultPageProps) {

  // Obtiene el Id del simulacro de la url
  const { simulacroId } = await params;
  if (!simulacroId) notFound();

  // Obtiene los resultados del simulacro
  const simulacroPreguntas = await getSimulacroResult(simulacroId);

  if (!simulacroPreguntas || simulacroPreguntas.length === 0) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Resultados del Simulacro</h1>
        <p>No se encontraron resultados para este simulacro.</p>
      </div>
    )
  }

  return <SimulacroResult simulacroPreguntas={simulacroPreguntas} />;
}