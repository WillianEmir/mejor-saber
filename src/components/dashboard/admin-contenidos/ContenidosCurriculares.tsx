'use client'

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Areatype } from '@/src/lib/schemas/area.schema';
import { ContenidoAreaType } from '@/src/lib/schemas/contenidoCurricular.schema';
import ContenidosCurricularesModal from './ContenidosCurricularesModal';
import { toast } from 'react-toastify';
import { deleteContenidoCurricular } from '@/src/lib/actions/contenidosCurricular.action';
import { no } from 'zod/locales';
// import { revalidatePath } from 'next/cache';

interface ContenidosCurricularesProps {
  areas: Areatype[];
  contenidosCurriculares: ContenidoAreaType[] 
}

export default function ContenidosCurriculares({ areas, contenidosCurriculares }: ContenidosCurricularesProps) {

  const router = useRouter();
  const pathname = usePathname();

  // State and handlers of Contenidos Curriculares
  const initialContenidoCurricularState = { areaId: '', nombre: '', id: '', area: { nombre: '', id: '' } }
  const [contenidoCurricularModal, setContenidoCurricularModal] = useState<ContenidoAreaType>(initialContenidoCurricularState)

  const handleContenidoCurricularEdit = (): void => {
    const params = new URLSearchParams();
    params.set('edit-contenido-curricular', 'true');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleContenidoCurricularAdd = (): void => {
    const params = new URLSearchParams();
    params.set('add-contenido-curricular', 'true');
    router.push(`${pathname}?${params.toString()}`);
  };

  const openContenidoCurricularModalEdit = (contenidoCurricular: ContenidoAreaType) => {
    handleContenidoCurricularEdit()
    setContenidoCurricularModal(contenidoCurricular)
  }

  const openContenidoCurricularModalAdd = () => {
    handleContenidoCurricularAdd()
    setContenidoCurricularModal(initialContenidoCurricularState);
  }

  const handleDelete = async (action: (id: string) => Promise<void | { message: string }>, id: string, type: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar est${type}?`)) {
      const result = await action(id);
      if (result?.message.includes('exitosamente')) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || 'Error al eliminar');
      }
    }
    router.push('/dashboard/admin/contenidos-curriculares') 
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
            Administración de Contenidos Curriculares
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Una lista de todos los contenidos curriculares en la base de datos, incluyendo su nombre y área.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={openContenidoCurricularModalAdd}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="w-5 h-5 -ml-0.5" />
            Agregar Contenido Curricular
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              {
                contenidosCurriculares && contenidosCurriculares.length > 0 ? (
                  <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                        >
                          Contenido Curricular
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                        >
                          Área
                        </th>
                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span className="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-900">
                      {contenidosCurriculares.map((content) => (
                        <tr key={content.id}>
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                            {content.nombre}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                            <span className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/10 px-2 py-1 text-xs font-medium text-blue-700 dark:text-blue-400 ring-1 ring-inset ring-blue-600/20">
                              {content.area.nombre}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex justify-end gap-x-4">
                              <button
                                onClick={() => openContenidoCurricularModalEdit(content)}
                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 flex items-center"
                              >
                                <PencilIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                                Editar
                                <span className="sr-only">, {content.nombre}</span>
                              </button>
                              <button
                                aria-label={`Eliminar contenido curricular ${content.nombre}`}
                                onClick={() => handleDelete(deleteContenidoCurricular, content.id!, 'a Contenido Curricular')}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 flex items-center"
                              >
                                <TrashIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                                Eliminar
                                <span className="sr-only">, {content.nombre}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-10 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay Contenidos Curriculares</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aún no se han agregado Contenidos Curriculares para mostrar.</p>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>

      <ContenidosCurricularesModal
        contenidoCurricular={contenidoCurricularModal}
        areas={areas}
      />
    </div>
  )
}
