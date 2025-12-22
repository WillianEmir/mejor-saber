import MiProgreso from './_components/MiProgreso';
import { getNivelesDesempenoData, getStudentProgressChartsData } from './_lib/progress.data';

export default async function MiProgresoPage() {

  // Fetch all data in parallel
  const [
    progressChartsData,
    nivelesDesempeno,
  ] = await Promise.all([
    getStudentProgressChartsData(),
    getNivelesDesempenoData(),
  ]);

  const { summaryData, overallProgressData, areaProgressData, areaAverages, competenciaAverages, evidenciaAverages } = progressChartsData;

  return (
    <div className="container mx-auto p-2 md:p-4">
      <MiProgreso
        summaryData={summaryData}
        generalProgressData={overallProgressData}
        areaProgressData={areaProgressData}
        competenciaAverages={competenciaAverages}
        areaAveragesData={areaAverages}
        evidenciaProgress={evidenciaAverages}
        nivelesDesempeno={nivelesDesempeno}
      />
    </div>
  );
}