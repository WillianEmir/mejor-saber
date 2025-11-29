
import { getAreas } from '@/app/dashboard/admin/areas/_lib/area.data';

import AreasList from './_components/area/AreasList';
import { notFound } from 'next/navigation'; 

export default async function page() {
  let areas;
  try {
    areas = await getAreas();
  } catch (error) {
    // Si getAreas falla, llama a notFound y detiene la ejecución.
    return notFound();
  }

  if (!areas || areas.length === 0) {
    // Si no hay áreas, llama a notFound y detiene la ejecución.
    return notFound();
  }

  return (
    <>
      <AreasList areas={areas} />
    </>
  );
}