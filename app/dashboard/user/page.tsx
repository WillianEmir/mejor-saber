import MiProgreso from './_components/MiProgreso';
import { getNivelesDesempenoData, getStudentProgressChartsData } from './_lib/progress.data';
import { auth } from '@/auth';
import { redirect } from 'next/navigation'; 
import { ActiveOfficialSimulacrosNotification } from './_components/ActiveOfficialSimulacrosNotification';
import { getActiveOfficialSimulacrosBySchoolId } from './simulacros/_lib/simulacro.data';

export default async function MiProgresoPage() { 
  const session = await auth();
  const userId = session?.user?.id;
  const userSchoolId = session?.user?.schoolId;

  if (!userId) { // Users without ID cannot access this. ADMINSCHOOL also has schoolId
    redirect('/auth/signin');
  }

  // Fetch all data in parallel
  const [
    progressChartsData,
    nivelesDesempeno,
    activeOfficialSimulacros, // Fetch active official simulacros
  ] = await Promise.all([
    getStudentProgressChartsData(),
    getNivelesDesempenoData(),
    userSchoolId && userId ? getActiveOfficialSimulacrosBySchoolId(userSchoolId, userId) : Promise.resolve([]), // Pass userId here
  ]);

  const { summaryData, overallProgressData, areaProgressData, areaAverages, competenciaAverages, evidenciaAverages } = progressChartsData;

  return (
    <div className="container mx-auto p-2 md:p-4">
      {userSchoolId && <ActiveOfficialSimulacrosNotification officialSimulacros={activeOfficialSimulacros} />}
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