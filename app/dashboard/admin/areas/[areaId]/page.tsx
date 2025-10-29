import { notFound } from 'next/navigation';

import { getAreaWithRelationsById } from '@/app/dashboard/admin/areas/_lib/area.data';

import AreaView from '@/app/dashboard/admin/areas/_components/area/AreaView'

interface pageProps {
  params: Promise<{
    areaId: string 
  }>
}

export default async function page({ params }: pageProps) {

  const { areaId } = await params;

  const area = await getAreaWithRelationsById(areaId)

  if(!area) notFound();
  
  return (
    <>
      <AreaView
        area={area}
      />
    </>
  )
}