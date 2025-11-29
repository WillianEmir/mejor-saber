import { notFound } from 'next/navigation';

import SimulacroCompetenciasList from '@/app/dashboard/user/simulacros/_components/SimulacroCompetenciasList';

import { getAreaCompetencias } from '../_lib/simulacro.data';

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
 