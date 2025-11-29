
import { getAreas } from '@/app/dashboard/admin/areas/_lib/area.data';

import AreasList from './_components/area/AreasList';

export default async function page() {

  const areas = await getAreas();

  return (
    <>
      <AreasList areas={areas} />
    </>
  );
}