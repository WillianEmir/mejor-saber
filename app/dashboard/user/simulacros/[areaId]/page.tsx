import { notFound } from 'next/navigation';

import { getAreaCompetencias } from '@/app/dashboard/admin/areas/_lib/area.data';

import SimulacroCompetenciasList from '@/app/dashboard/user/simulacros/_components/SimulacroCompetenciasList';

interface pageProps { 
  params: Promise<{ 
    areaId: string 
  }>
}

export default async function Page({ params }: pageProps) {

  // Obtiene el Id del área desde la url
  const {areaId} = await params;
  const area = await getAreaCompetencias(areaId);

  if(!area) notFound() 

  return (
    <>
      <SimulacroCompetenciasList area={area} />
    </>
  );
}
 