import { notFound } from 'next/navigation';

import { getAreaCompetencias } from '@/src/lib/data/areas.data';
import SimulacroCompetenciasList from '@/app/dashboard/user/simulacros/components/SimulacroCompetenciasList';

interface pageProps { 
  params: Promise<{ 
    areaId: string 
  }>
}

export default async function Page({ params }: pageProps) {

  const {areaId} = await params;

  const area = await getAreaCompetencias(areaId);

  if(!area) notFound() 

  return (
    <>
      <SimulacroCompetenciasList area={area} />
    </>
  );
}
 