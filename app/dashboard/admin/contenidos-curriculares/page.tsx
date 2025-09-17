import ContenidosCurricularesList from '@/src/components/dashboard/admin-contenidos/contenidos-list/ContenidosCurricularesList';
import { getAreas } from '@/src/lib/data/areas.data';
import { getContenidosWithRelations } from '@/src/lib/data/ContenidosCurriculares.data';
import { Areatype } from '@/src/lib/schemas/area.schema';

export default async function page() {

  const areas: Areatype[] = await getAreas();
  const contenidosCurriculares = await getContenidosWithRelations();  

  return (
    <>
      <ContenidosCurricularesList 
        areas={areas}
        contenidosCurriculares={contenidosCurriculares} 
      />
    </>
  )
}
