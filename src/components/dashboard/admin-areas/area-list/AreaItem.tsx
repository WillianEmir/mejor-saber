'use client'

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

import ButtonEditArea from './ButtonEditArea'
import ButtonDeleteArea from './ButtonDeleteArea'
import { ArrowLeftIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import AreaModal from './AreaModal'
import type { AreaWithRelationsType } from '@/src/lib/schemas/area.schema';
import ButtonAdd from '../ui/ButtonAdd';
import CompetenciaModal from '../competencia-modal/CompetenciaModal';
import type { CompetenciaType } from '@/src/lib/schemas/competencia.schema';
import { deleteCompetencia } from '@/src/lib/actions/competencia.actions';
import type { AfirmacionType } from '@/src/lib/schemas/afirmacion.schema';
import { deleteAfirmacion } from '@/src/lib/actions/afirmacion.actions';
import AfirmacionModal from '../afirmacion-modal/AfirmacionModal';
import EvidenciaModal from '../evidencia-modal/EvidenciaModal';
import type { EvidenciaType } from '@/src/lib/schemas/evidencia.schema';
import { deleteEviencia } from '@/src/lib/actions/evidencia.actions';

interface AreaItemProps {
  area: AreaWithRelationsType 
}

export default function AreaItem({ area }: AreaItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  // State and handlers of Competencias
  const initialCompetenciaState = { areaId: '', nombre: '', id: '' }
  const [competenciaModal, setCompetenciaModal] = useState<CompetenciaType>(initialCompetenciaState)
  const handleCompetenciaEdit = () => {
    const params = new URLSearchParams();
    params.set('edit-competencia', 'true');
    router.push(`${pathname}?${params.toString()}`);
  };

  const openCompetenciaModalEdit = (competencia: CompetenciaType) => {
    setCompetenciaModal(competencia)
    handleCompetenciaEdit()
  }

  // State and handlers of Afirmaciones
  const initialAfirmacionState = { competenciaId: '', nombre: '', id: '' }
  const [afirmacionModal, setAfirmacionModal] = useState<AfirmacionType>(initialAfirmacionState)
  const [afirmacionParentId, setAfirmacionParentId] = useState<string>('');

  const handleAfirmacionEdit = () => {
    const params = new URLSearchParams();
    params.set('edit-afirmacion', 'true');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleAfirmacionAdd = () => {
    const params = new URLSearchParams();
    params.set('add-afirmacion', 'true');
    router.push(`${pathname}?${params.toString()}`);
  };

  const openAfirmacionModalEdit = (afirmacion: AfirmacionType) => {
    setAfirmacionParentId(afirmacion.competenciaId);
    setAfirmacionModal(afirmacion)
    handleAfirmacionEdit()
  }

  const openAfirmacionModalAdd = (competenciaId: string) => {
    setAfirmacionParentId(competenciaId);
    setAfirmacionModal(initialAfirmacionState);
    handleAfirmacionAdd()
  }

  // State and handlers of Evidencias
  const initialEvidenciaState = { afirmacionId: '', nombre: '', id: '' };
  const [evidenciaModal, setEvidenciaModal] = useState<EvidenciaType>(initialEvidenciaState);
  const [evidenciaParentId, setEvidenciaParentId] = useState<string>('');

  const handleEvidenciaEdit = () => {
    const params = new URLSearchParams();
    params.set('edit-evidencia', 'true');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEvidenciaAdd = () => {
    const params = new URLSearchParams();
    params.set('add-evidencia', 'true');
    router.push(`${pathname}?${params.toString()}`);
  };

  const openEvidenciaModalEdit = (evidencia: EvidenciaType) => {
    setEvidenciaParentId(evidencia.afirmacionId);
    setEvidenciaModal(evidencia);
    handleEvidenciaEdit();
  };

  const openEvidenciaModalAdd = (afirmacionId: string) => {
    setEvidenciaParentId(afirmacionId);
    setEvidenciaModal(initialEvidenciaState);
    handleEvidenciaAdd();
  };

  const handleDelete = async (action: (id: string) => Promise<void | { message: string}>, id: string, type: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar est${type}?`)) {
      const result = await action(id);
      if (result?.message.includes('exitosamente')) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || 'Error al eliminar');
      }
    }
  };

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className="mb-4">
        <Link href="/dashboard/admin/areas" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Volver a las Áreas</span>
        </Link>
      </div>
      <header className="sm:flex sm:items-center sm:justify-between pb-8 border-b border-gray-200 dark:border-gray-700">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">

            {area.nombre}
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Gestiona las competencias, afirmaciones y evidencias de esta área.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-2">
          <ButtonEditArea area={area} />
          <ButtonDeleteArea area={area} />
        </div>
      </header>

      <section className="mt-8">
        <div className='flex justify-between'>
          <h2 className="text-xl font-semibold leading-6 text-gray-900 dark:text-white">
            Competencias, Afirmaciones y Evidencias
          </h2>
          <ButtonAdd
            textAdd="Competencia"
            textParams="competencia"
          />
        </div>
        <div className="mt-6 space-y-6">
          {area.competencias && area.competencias.length > 0 ? (
            area.competencias.map((competencia) => (
              <div key={competencia.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">

                <div className='flex justify-between border-b border-gray-100'>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{competencia.nombre}</h3>

                  <div className='flex gap-2 '>
                    <button aria-label={`Agregar afirmación a ${competencia.nombre}`} onClick={() => openAfirmacionModalAdd(competencia.id!)}>
                      <PlusIcon className='size-6 bg-blue-300 text-slate-800 p-0.5 rounded-md' aria-hidden="true" />
                    </button>

                    <button
                      aria-label={`Editar competencia ${competencia.nombre}`}
                      onClick={() => openCompetenciaModalEdit(competencia)}
                    >
                      <PencilIcon className='size-6 bg-yellow-300 text-slate-800 p-0.5 rounded-md' aria-hidden="true" />
                    </button>

                    <button
                      aria-label={`Eliminar competencia ${competencia.nombre}`}
                      onClick={() => handleDelete(deleteCompetencia, competencia.id!, 'a competencia')}
                    >
                      <TrashIcon className='size-6 bg-red-300 text-slate-800 p-0.5 rounded-md' aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 ml-4 space-y-4">
                  {competencia.afirmaciones && competencia.afirmaciones.length > 0 ? (
                    competencia.afirmaciones.map((afirmacion) => (
                      <div key={afirmacion.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
                        <div className='flex justify-between border-b border-gray-100'>
                          <h4 className="font-medium text-gray-700 dark:text-gray-300">{afirmacion.nombre}</h4>
                          <div className='flex gap-2 '>
                            
                            <button aria-label={`Agregar evidencia a ${afirmacion.nombre}`} onClick={() => openEvidenciaModalAdd(afirmacion.id!)}>
                              <PlusIcon className='size-6 bg-blue-300 text-slate-800 p-0.5 rounded-md' aria-hidden="true" />
                            </button>

                            <button
                              aria-label={`Editar afirmación ${afirmacion.nombre}`}
                              onClick={() => openAfirmacionModalEdit(afirmacion)}
                            >
                              <PencilIcon className='size-6 bg-yellow-300 text-slate-800 p-0.5 rounded-md' aria-hidden="true" />
                            </button>

                            <button
                              aria-label={`Eliminar afirmación ${afirmacion.nombre}`}
                              onClick={() => handleDelete(deleteAfirmacion, afirmacion.id!, 'a afirmación')}
                            >
                              <TrashIcon className='size-6 bg-red-300 text-slate-800 p-0.5 rounded-md' aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                        <ul className="mt-2 ml-5 space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                          {afirmacion.evidencias && afirmacion.evidencias.length > 0 ? (
                            afirmacion.evidencias.map((evidencia) => (
                              <li key={evidencia.id} className="flex justify-between items-center text-sm border-b border-gray-100 py-1">
                                <div>{evidencia.nombre}</div>
                                <div className='flex gap-2 '>
                                  <button
                                    aria-label={`Editar evidencia ${evidencia.nombre}`}
                                    onClick={() => openEvidenciaModalEdit(evidencia)}
                                  >
                                    <PencilIcon className='size-5 bg-yellow-300 text-slate-800 p-0.5 rounded-md' aria-hidden="true" />
                                  </button>

                                  <button
                                    aria-label={`Eliminar evidencia ${evidencia.nombre}`}
                                    onClick={() => handleDelete(deleteEviencia, evidencia.id!, 'a evidencia')}
                                  >
                                    <TrashIcon className='size-5 bg-red-300 text-slate-800 p-0.5 rounded-md' aria-hidden="true" />
                                  </button>
                                </div>
                              </li>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No hay evidencias para esta afirmación.</p>
                          )}
                        </ul>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">No hay afirmaciones para esta competencia.</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay competencias</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aún no se han agregado competencias para esta área.</p>
            </div>
          )}
        </div>
      </section>

      <AreaModal
        area={area}
      />

      <CompetenciaModal
        areaId={area.id}
        competencia={competenciaModal}
      />

      <AfirmacionModal
        competenciaId={afirmacionParentId}
        afirmacion={afirmacionModal}
      />

      <EvidenciaModal
        afirmacionId={evidenciaParentId}
        evidencia={evidenciaModal}
      />
    </div>
  )
}
