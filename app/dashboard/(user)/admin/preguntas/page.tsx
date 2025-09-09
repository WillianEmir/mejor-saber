import AdminPreguntas from '@/src/components/dashboard/admin-preguntas/AdminPreguntas'
import { getAreasWithRelations } from '@/src/lib/data/areas.data'
import { getContenidosWithRelations } from '@/src/lib/data/contenidosCurriculares.data'
import { getPreguntasWithRelations } from '@/src/lib/data/preguntas.data'

import { ToastContainer } from 'react-toastify'

export default async function page() { 

  const preguntas = await getPreguntasWithRelations()
  const areas = await getAreasWithRelations()
  const contenidosCurriculares = await getContenidosWithRelations()

  return ( 
    <>
      <AdminPreguntas
        preguntas={preguntas} 
        areas={areas}
        contenidosCurriculares={contenidosCurriculares}
      />
      <ToastContainer /> 
    </> 
  )
}
