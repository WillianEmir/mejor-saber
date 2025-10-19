import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { notFound } from 'next/navigation';

import { getAreas } from '@/src/lib/data/areas.data';
import { getSimulacrosByUserId } from './lib/simulacro.data';

import SimulacroAreasList from '@/app/dashboard/user/simulacros/components/SimulacroAreasList';
import SimulacroAreasListHeader from './components/SimulacroAreasListHeader';
import SimulacroHistory from './components/SimulacroHistory';

export default async function Simulacros() { 

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;

  if (!userId) notFound()

  const [areas, simulacros] = await Promise.all([ getAreas(), getSimulacrosByUserId(userId) ]);

  return (
    <>
      <SimulacroAreasListHeader />
      <SimulacroAreasList areas={areas}  />
      <SimulacroHistory simulacros={simulacros}/>
    </>
  );
}
