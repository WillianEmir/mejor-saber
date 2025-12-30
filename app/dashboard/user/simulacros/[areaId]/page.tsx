import { notFound } from 'next/navigation';

import SimulacroCompetenciasList from '@/app/dashboard/user/simulacros/_components/SimulacroCompetenciasList';

import { getAreaCompetencias } from '../_lib/simulacro.data';

interface pageProps {
  params: Promise<{
    areaId: string
  }>,
  searchParams?: Promise<{
    officialSimulacroId: string
  }>
;
}

export default async function Page({ params, searchParams }: pageProps) {

  const { areaId } = await params;
  const { officialSimulacroId } = await searchParams || {};

  const area = await getAreaCompetencias(areaId);

  if (!area) notFound()

  return (
    <>
      <SimulacroCompetenciasList area={area} officialSimulacroId={officialSimulacroId} />
    </>
  );
}
