'use client'

import { useState, useEffect, useTransition } from 'react'
import { notFound, usePathname } from 'next/navigation'

import { toggleSeccionProgreso, toggleSubTemaProgreso, toggleActividadProgreso } from '@/app/dashboard/user/material-repaso/_lib/progreso.actions'

import EjeTematicoHeader from './EjeTematicoHeader'
import EjeTematicoIntroduccion from './EjeTematicoIntroduccion'
import EjeTematicoObjetivos from './EjeTematicoObjetivos'
import EjeTematicoSecciones from './eje-tematico-secciones/EjeTematicoSecciones'

import { EjeTematicoWithRelationsType } from '@/app/dashboard/admin/contenidos-curriculares/_lib/ejeTematico.schema'
import { toast } from 'sonner'

interface EjeTematicoViewProps {
  ejeTematico: EjeTematicoWithRelationsType
}

export function EjeTematicoView({ ejeTematico }: EjeTematicoViewProps) {

  const [isPending, startTransition] = useTransition()
  const [progreso, setProgreso] = useState(() => {
    const initialProgreso: { [key: string]: boolean } = {}
    if (ejeTematico) {
      ejeTematico.secciones.forEach(seccion => {
        seccion.subTemas.forEach(subTema => {
          initialProgreso[subTema.id] = subTema.progresos.length > 0 && !!subTema.progresos[0].completado
        })
        seccion.actividades.forEach(actividad => {
          initialProgreso[actividad.id] = actividad.progresos.length > 0 && !!actividad.progresos[0].completado
        })
      })
    }
    return initialProgreso
  })

  const pathname = usePathname()

  if (!ejeTematico) notFound()

  useEffect(() => {
    ejeTematico.secciones.forEach(seccion => {
      const allChildrenCompleted =
        seccion.subTemas.every(st => progreso[st.id]) &&
        seccion.actividades.every(a => progreso[a.id])

      const isSeccionMarkedAsCompleted = seccion.progresos.length > 0 && seccion.progresos[0].completada

      if (allChildrenCompleted && !isSeccionMarkedAsCompleted) {
        startTransition(async() => {
          const result = await toggleSeccionProgreso(seccion.id, pathname, false)
          if (result) toast.success(result.message)
        })
      } else if (!allChildrenCompleted && isSeccionMarkedAsCompleted) {
        startTransition(async() => {
          const result = await toggleSeccionProgreso(seccion.id, pathname, true)
          if (result) toast.success(result.message)
        })
      }
    })
  }, [progreso, ejeTematico, pathname])

  const handleSubTemaToggle = (subTemaId: string) => {
    const currentStatus = !!progreso[subTemaId]
    setProgreso(prev => ({ ...prev, [subTemaId]: !currentStatus }))
    startTransition(async () => {
      const result = await toggleSubTemaProgreso(subTemaId, pathname, currentStatus)
      if (result) toast.success(result.message)
    })
  }

  const handleActividadToggle = (actividadId: string) => {
    const currentStatus = !!progreso[actividadId]
    setProgreso(prev => ({ ...prev, [actividadId]: !currentStatus }))
    startTransition(async () => {
      const result = await toggleActividadProgreso(actividadId, pathname, currentStatus)
      if (result) toast.success(result.message)
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-6">

      <EjeTematicoHeader
        url='/dashboard/user/material-repaso'
        texto='Volver al Material de Repaso'
        title={ejeTematico.nombre}
      />

      <EjeTematicoIntroduccion ejeTematico={ejeTematico} />

      <EjeTematicoObjetivos objetivosAprendizaje={ejeTematico.objetivosAprendizaje} />

      {ejeTematico.secciones.length > 0 && ejeTematico.secciones.map(seccion => {
        return (
          <EjeTematicoSecciones
            seccion={seccion}
            progreso={progreso}
            handleSubTemaToggle={handleSubTemaToggle}
            handleActividadToggle={handleActividadToggle}
            isPending={isPending}
            key={seccion.id}
          />
        )
      })}
    </div>
  )
}
