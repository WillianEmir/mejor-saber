'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AreaWithRelationsType } from '@/src/lib/schemas/area.schema';
import { CompetenciaWithRelations } from '@/src/lib/schemas/competencia.schema';
import { AfirmacionWithEvidencias } from '@/src/lib/schemas/afirmacion.schema';
import { EvidenciaType } from '@/src/lib/schemas/evidencia.schema';

interface PreguntasFiltersProps {
  areas: AreaWithRelationsType[];
}

export default function PreguntasFilters({ areas }: PreguntasFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const areaId = searchParams.get('areaId');
  const competenciaId = searchParams.get('competenciaId');
  const afirmacionId = searchParams.get('afirmacionId');
  const evidenciaId = searchParams.get('evidenciaId');

  const [competencias, setCompetencias] = useState<CompetenciaWithRelations[]>([]);
  const [afirmaciones, setAfirmaciones] = useState<AfirmacionWithEvidencias[]>([]);
  const [evidencias, setEvidencias] = useState<EvidenciaType[]>([]);

  useEffect(() => {
    if (areaId) {
      const area = areas.find((a) => a!.id === areaId);
      setCompetencias(area?.competencias || []);
    } else {
      setCompetencias([]);
    }
  }, [areaId, areas]);

  useEffect(() => {
    if (competenciaId) {
      const competencia = competencias.find((c) => c.id === competenciaId);
      setAfirmaciones(competencia?.afirmaciones || []);
    } else {
      setAfirmaciones([]);
    }
  }, [competenciaId, competencias]);

  useEffect(() => {
    if (afirmacionId) {
      const afirmacion = afirmaciones.find((a) => a.id === afirmacionId);
      setEvidencias(afirmacion?.evidencias || []);
    } else {
      setEvidencias([]);
    }
  }, [afirmacionId, afirmaciones]);

  const handleFilterChange = (filter: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (filter === 'areaId') {
      params.delete('competenciaId');
      params.delete('afirmacionId');
      params.delete('evidenciaId');
    } else if (filter === 'competenciaId') {
      params.delete('afirmacionId');
      params.delete('evidenciaId');
    } else if (filter === 'afirmacionId') {
      params.delete('evidenciaId');
    }

    if (value) {
      params.set(filter, value);
    } else {
      params.delete(filter);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
      <select
        value={areaId || ''}
        onChange={(e) => handleFilterChange('areaId', e.target.value)}
        className="p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        <option value="">Todas las Áreas</option>
        {areas.map((area) => (
          <option key={area!.id} value={area!.id}>
            {area!.nombre}
          </option>
        ))}
      </select>

      <select
        value={competenciaId || ''}
        onChange={(e) => handleFilterChange('competenciaId', e.target.value)}
        disabled={!areaId}
        className="p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        <option value="">Todas las Competencias</option>
        {competencias.map((competencia) => (
          <option key={competencia.id} value={competencia.id}>
            {competencia.nombre}
          </option>
        ))}
      </select>

      <select
        value={afirmacionId || ''}
        onChange={(e) => handleFilterChange('afirmacionId', e.target.value)}
        disabled={!competenciaId}
        className="p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        <option value="">Todas las Afirmaciones</option>
        {afirmaciones.map((afirmacion) => (
          <option key={afirmacion.id} value={afirmacion.id}>
            {afirmacion.nombre}
          </option>
        ))}
      </select>

      <select
        value={evidenciaId || ''}
        onChange={(e) => handleFilterChange('evidenciaId', e.target.value)}
        disabled={!afirmacionId}
        className="p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
      >
        <option value="">Todas las Evidencias</option>
        {evidencias.map((evidencia) => (
          <option key={evidencia.id} value={evidencia.id}>
            {evidencia.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
