import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getAreas, getOfficialSimulacrosBySchoolId } from './_lib/data';
import { SimulacrosOficialesClient } from './_components/SimulacrosOficialesClient';


export default async function SimulacrosOficialesPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const userSchoolId = session?.user?.schoolId;

  if (!userId || userRole !== 'ADMINSCHOOL' || !userSchoolId) {
    redirect('/auth/signin');
  }

  const [officialSimulacros, areas] = await Promise.all([
    getOfficialSimulacrosBySchoolId(userSchoolId),
    getAreas(),
  ]);

  return (
    <SimulacrosOficialesClient simulacros={officialSimulacros} areas={areas} />
  );
}
