import { getOverallProgressChartData, getUserProgressData, getCompetenciaProgressData, getEvidenciaProgressData } from './lib/progress.data';
import MiProgreso from './_components/MiProgreso';

export default async function MiProgresoPage() {

  const { areaAverages, simulacros } = await getUserProgressData();
  const { initialScore, overallAverage, finalScore } = await getOverallProgressChartData();
  const competenciaProgress = await getCompetenciaProgressData();
  const evidenciaProgress = await getEvidenciaProgressData();

  const generalProgressData = {
    labels: ['Estado Inicial', 'Promedio General', 'Estado Final'],
    datasets: [
      {
        label: 'Progreso General',
        data: [initialScore, overallAverage, finalScore],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)', 
          'rgba(54, 162, 235, 0.5)', 
          'rgba(75, 192, 192, 0.5)'
        ],
      },
    ],
  };

  const areaProgressData = {
    labels: areaAverages.map(a => a.name),
    datasets: [
      {
        label: 'Promedio por Área',
        data: areaAverages.map(a => a.average),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Mi Progreso</h1>

      {simulacros.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>Aún no has realizado ningún simulacro.</p>
          <p>¡Completa uno para ver tu progreso!</p>
        </div>
      ) : (
        <MiProgreso
          generalProgressData={generalProgressData}
          areaProgressData={areaProgressData}
          competenciaProgress={competenciaProgress}
          areaAverages={areaAverages}
          evidenciaProgress={evidenciaProgress}
        />
      )}
    </div>
  );
}