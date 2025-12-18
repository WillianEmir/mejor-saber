import MiProgreso from './_components/MiProgreso';
import { getCompetenciaProgressData, getEvidenciaProgressData, getNivelesDesempenoData, getOverallProgressChartData, getUserProgressData } from './_lib/progress.data';

export default async function MiProgresoPage() { 

  const generalProgressData = await getOverallProgressChartData();
  const { areaAverages, simulacros, areaProgressData } = await getUserProgressData();
  const competenciaProgress = await getCompetenciaProgressData();
  const evidenciaProgress = await getEvidenciaProgressData();
  const nivelesDesempeno = await getNivelesDesempenoData();
    
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
          nivelesDesempeno={nivelesDesempeno}
        />
      )}
    </div>
  );
}