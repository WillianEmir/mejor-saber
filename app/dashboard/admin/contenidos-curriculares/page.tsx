import { getAreas } from '@/app/dashboard/admin/areas/_lib/area.data';
import { getContenidosWithRelations } from '@/app/dashboard/admin/contenidos-curriculares/_lib/contenidoCurricular.data';

import ContenidosCurricularesList from '@/app/dashboard/admin/contenidos-curriculares/_components/contenidos/ContenidosCurricularesList';
import { notFound } from 'next/navigation';

export default async function page() {

  const [areas, contenidosCurriculares] = await Promise.all([
    getAreas(),
    getContenidosWithRelations(),
  ]);

  if(!areas || !contenidosCurriculares) notFound()

  return (
    <>
      <ContenidosCurricularesList 
        areas={areas}
        contenidosCurriculares={contenidosCurriculares} 
      />
    </> 
  )
}
