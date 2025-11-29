'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { AreaWithRelationsType } from '@/app/dashboard/admin/areas/_lib/area.schema'
import { CompetenciaWithRelationsType } from '@/app/dashboard/admin/areas/_lib/competencia.schema'
import { AfirmacionWithEvidenciasType } from '@/app/dashboard/admin/areas/_lib/afirmacion.schema'
import { EvidenciaType } from '@/app/dashboard/admin/areas/_lib/evidencia.schema'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select'

interface PreguntasFiltersProps {
  areas: AreaWithRelationsType[]
}

export default function PreguntasFilters({ areas }: PreguntasFiltersProps) {

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [competencias, setCompetencias] = useState<CompetenciaWithRelationsType[]>([])
  const [afirmaciones, setAfirmaciones] = useState<AfirmacionWithEvidenciasType[]>([])
  const [evidencias, setEvidencias] = useState<EvidenciaType[]>([])

  const areaId = searchParams.get('areaId')
  const competenciaId = searchParams.get('competenciaId')
  const afirmacionId = searchParams.get('afirmacionId')
  const evidenciaId = searchParams.get('evidenciaId')

  useEffect(() => {
    if (areaId) {
      const area = areas.find((a) => a!.id === areaId)
      setCompetencias(area?.competencias || [])
    } else {
      setCompetencias([])
    }
  }, [areaId, areas])

  useEffect(() => {
    if (competenciaId) {
      const competencia = competencias.find((c) => c.id === competenciaId)
      setAfirmaciones(competencia?.afirmaciones || [])
    } else {
      setAfirmaciones([])
    }
  }, [competenciaId, competencias])

  useEffect(() => {
    if (afirmacionId) {
      const afirmacion = afirmaciones.find((a) => a.id === afirmacionId)
      setEvidencias(afirmacion?.evidencias || [])
    } else {
      setEvidencias([])
    }
  }, [afirmacionId, afirmaciones])

  const handleFilterChange = (filter: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')

    if (filter === 'areaId') {
      params.delete('competenciaId')
      params.delete('afirmacionId')
      params.delete('evidenciaId')
    } else if (filter === 'competenciaId') {
      params.delete('afirmacionId')
      params.delete('evidenciaId')
    } else if (filter === 'afirmacionId') {
      params.delete('evidenciaId')
    }

    if (value && value !== 'all') {
      params.set(filter, value)
    } else {
      params.delete(filter)
    }

    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
      <Select
        value={areaId || ''}
        onValueChange={(value) => handleFilterChange('areaId', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas las Áreas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las Áreas</SelectItem>
          {areas.map((area) => (
            <SelectItem key={area!.id} value={area!.id}>
              {area!.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={competenciaId || ''}
        onValueChange={(value) => handleFilterChange('competenciaId', value)}
        disabled={!areaId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas las Competencias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las Competencias</SelectItem>
          {competencias.map((competencia) => (
            <SelectItem key={competencia.id} value={competencia.id}>
              {competencia.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={afirmacionId || ''}
        onValueChange={(value) => handleFilterChange('afirmacionId', value)}
        disabled={!competenciaId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas las Afirmaciones" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las Afirmaciones</SelectItem>
          {afirmaciones.map((afirmacion) => (
            <SelectItem key={afirmacion.id} value={afirmacion.id}>
              {afirmacion.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={evidenciaId || ''}
        onValueChange={(value) => handleFilterChange('evidenciaId', value)}
        disabled={!afirmacionId}
      >
        <SelectTrigger>
          <SelectValue placeholder="Todas las Evidencias" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las Evidencias</SelectItem>
          {evidencias.map((evidencia) => (
            <SelectItem key={evidencia.id} value={evidencia.id}>
              {evidencia.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}