import ContenidosCurriculares from '@/src/components/dashboard/admin-contenidos/ContenidosCurriculares'
import { getAreas } from '@/src/lib/data/areas.data';
import { getContenidosCurriculares } from '@/src/lib/data/ContenidosCurriculares.data';
import { Areatype } from '@/src/lib/schemas/area.schema';
import { ContenidoAreaType, ContenidoCurricularType } from '@/src/lib/schemas/contenidoCurricular.schema';
import { ToastContainer } from 'react-toastify';

export default async function page() {

  const areas: Areatype[] = await getAreas();
  const contenidosCurriculares: ContenidoAreaType[] = await getContenidosCurriculares();  

  return (
    <>
      <ContenidosCurriculares
        areas={areas}
        contenidosCurriculares={contenidosCurriculares}
      />
      <ToastContainer />
    </>
  )
}
