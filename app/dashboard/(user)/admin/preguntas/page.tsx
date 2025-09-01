import AdminPreguntas from '@/src/components/dashboard/admin-preguntas/AdminPreguntas'
import { Pregunta } from '@/src/generated/prisma'
import { getAreasFull } from '@/src/lib/data/areas.data'
import { getPreguntas } from '@/src/lib/data/preguntas.data'
import { AreasFullType } from '@/src/lib/schemas/area.schema'
import { PreguntaType } from '@/src/lib/schemas/pregunta.schema'
import { ToastContainer } from 'react-toastify'

export default async function page() {

  const preguntas : PreguntaType[] = await getPreguntas()
  const areasFull : AreasFullType[] = await getAreasFull()

  return (
    <>
      <AdminPreguntas
        preguntas={preguntas} 
        areasFull={areasFull}
      />
      <ToastContainer /> 
    </>
  )
}
