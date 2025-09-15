import AreasList from '@/src/components/dashboard/admin-areas/area-list/AreasList';
import { getAreas } from '@/src/lib/data/areas.data';

export default async function page() {
  
  const areas = await getAreas();

  return (
    <>
      <AreasList areas={areas} />
    </>
  )
}