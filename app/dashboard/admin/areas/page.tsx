
import { getAreas } from '@/app/dashboard/admin/areas/_lib/area.data';
import AreasList from './_components/area/AreasList';
import { notFound } from 'next/navigation';

export default async function page() {
  
  const areas = await getAreas();

  if(!areas) notFound()

  return (
    <>
      <AreasList areas={areas} />
    </>
  )
}