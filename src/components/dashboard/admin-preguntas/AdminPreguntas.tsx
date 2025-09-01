'use client'

import { useTransition, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { EyeIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import { Pregunta } from '@/src/generated/prisma';
import { AreasFullType } from '@/src/lib/schemas/area.schema';
import { deletePregunta } from '@/src/lib/actions/pregunta.action';
import PreguntaModal from './pregunta-modal/PreguntaModal';
import { PreguntaType } from '@/src/lib/schemas/pregunta.schema';

interface AdminPreguntasProps {
  preguntas: PreguntaType[];
  areasFull: AreasFullType[];
}

export default function AdminPreguntas({ preguntas, areasFull }: AdminPreguntasProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selectedPregunta, setSelectedPregunta] = useState<PreguntaType | undefined>( undefined );

  const handlePreguntaAdd = (): void => {
    const params = new URLSearchParams();
    params.set('add-question', 'true');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleEdit = (pregunta: PreguntaType) => {
    setSelectedPregunta(pregunta);
    const params = new URLSearchParams();
    params.set('edit-question', 'true');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleView = (pregunta: PreguntaType) => {
    setSelectedPregunta(pregunta);
    const params = new URLSearchParams();
    params.set('view-question', 'true');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
      startTransition(async () => {
        const result = await deletePregunta(id);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      });
    }
  };

  const getAreaName = (evidenciaId: string) => {
    for (const area of areasFull) {
      for (const competencia of area.competencias) {
        for (const afirmacion of competencia.afirmaciones) {
          if (afirmacion.evidencias.some(ev => ev.id === evidenciaId)) {
            return area.nombre;
          }
        }
      }
    }
    return 'N/A';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">Administración de Preguntas</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Una lista de todas las preguntas en la base de datos, incluyendo su enunciado y campo de evaluación.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handlePreguntaAdd}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="w-5 h-5 -ml-0.5" />
            Agregar Pregunta
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {preguntas.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                        Contexto y Enunciado
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                        Área
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-900">
                    {preguntas.map((pregunta) => (
                      <tr key={pregunta.id}>
                        <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900 dark:text-white truncate w-[200px]">{pregunta.contexto}</div>
                          <div className="mt-1 text-gray-500 dark:text-gray-400 truncate w-[200px]">{pregunta.enunciado}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                          <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/10 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400 ring-1 ring-inset ring-green-600/20">
                            {getAreaName(pregunta.evidenciaId)}
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end gap-x-4">
                            <button
                              onClick={() => handleView(pregunta)}
                              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 flex items-center"
                            >
                              <EyeIcon className="h-5 w-5 mr-1" /><span className="sr-only">, {pregunta.id}</span>
                            </button>
                            <button
                              onClick={() => handleEdit(pregunta)}
                              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
                            >
                              <PencilIcon className="h-5 w-5 mr-1" /><span className="sr-only">, {pregunta.id}</span>
                            </button>
                            <button
                              onClick={() => handleDelete(pregunta.id!)}
                              disabled={isPending}
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center disabled:opacity-50"
                            >
                              <TrashIcon className="h-5 w-5 mr-1" /><span className="sr-only">, {pregunta.id}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay Preguntas</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aún no se han agregado Preguntas para mostrar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {(searchParams.has('add-question') || searchParams.has('edit-question') || searchParams.has('view-question')) && (
        <PreguntaModal
          areasFull={areasFull}
          pregunta={searchParams.has('edit-question') || searchParams.has('view-question') ? selectedPregunta : undefined}
          isViewMode={searchParams.has('view-question')}
        />
      )}
    </div>
  );
}
