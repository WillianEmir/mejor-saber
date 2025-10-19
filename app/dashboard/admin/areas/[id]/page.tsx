import AreaView from '@/src/components/dashboard/admin-areas/area-view/AreaView'
import { getAreaWithRelationsById } from '@/src/lib/data/areas.data';
import { notFound } from 'next/navigation';

interface pageProps {
  params: Promise<{
    id: string 
  }>
}

export default async function page({ params }: pageProps) {

  const { id } = await params;

  const area = await getAreaWithRelationsById(id)

  if(!area) notFound();
  
  return (
    <>
      <AreaView
        area={area}
      />
    </>
  )
}
