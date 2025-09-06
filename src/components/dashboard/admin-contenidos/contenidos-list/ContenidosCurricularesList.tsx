'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'

import type { Areatype } from '@/src/lib/schemas/area.schema'
import type { ContenidoWithRelationsType } from '@/src/lib/schemas/contenidoCurricular.schema'
import type { EjeTematicoType } from '@/src/lib/schemas/ejeTematico.schema'
import { deleteEjeTematico } from '@/src/lib/actions/ejeTematico.action'

import HeaderContenidosCurriculares from './HeaderContenidosCurriculares'
import ContenidosCurricularesModal from '../ContenidosCurricularesModal'
import EjeTematicoModal from '../EjesTematicosModal'
import ContenidoCurricularItem from './ContenidoCurricularItem'
import { deleteContenidoCurricular } from '@/src/lib/actions/contenidosCurricular.action'

interface ContenidosCurricularesListProps {
  areas: Areatype[];
  contenidosCurriculares: ContenidoWithRelationsType[];
}

export default function ContenidosCurricularesList({ areas, contenidosCurriculares }: ContenidosCurricularesListProps) {
  const [isContenidoModalOpen, setIsContenidoModalOpen] = useState(false);
  const [isEjeModalOpen, setIsEjeModalOpen] = useState(false);
  const [selectedEje, setSelectedEje] = useState<EjeTematicoType | null>(null);
  const [selectedContenido, setSelectedContenido] = useState<ContenidoWithRelationsType | null>(null); //TODO: Quitar este null
  const [selectedContenidoId, setSelectedContenidoId] = useState<string>('');

  const handleAddContenido = () => {
    setSelectedContenido(null);
    setIsContenidoModalOpen(true);
  };

  const handleEditContenido = (contenido: ContenidoWithRelationsType) => {
    setSelectedContenido(contenido);
    setIsContenidoModalOpen(true);
  };

  const handleDeleteContenido = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este contenido curricular?')) {
      const result = await deleteContenidoCurricular(id);
      if (result?.message.includes('exitosamente')) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || 'Error al eliminar');
      }
    }
  };

  const handleCloseContenidoModal = () => {
    setIsContenidoModalOpen(false);
    setSelectedContenido(null);
  };

  const handleAddEje = (contenidoId: string) => {
    setSelectedEje(null);
    setSelectedContenidoId(contenidoId);
    setIsEjeModalOpen(true);
  };

  const handleEditEje = (eje: EjeTematicoType) => {
    setSelectedEje(eje);
    setSelectedContenidoId(eje.contenidoCurricularId!);
    setIsEjeModalOpen(true);
  };

  const handleDeleteEje = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este eje temático?')) {
      const result = await deleteEjeTematico(id);
      if (result?.message.includes('exitosamente')) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || 'Error al eliminar');
      }
    }
  };

  const handleCloseEjeModal = () => {
    setIsEjeModalOpen(false);
    setSelectedEje(null);
    setSelectedContenidoId('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <HeaderContenidosCurriculares onAddContenido={handleAddContenido} />

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          {contenidosCurriculares && contenidosCurriculares.length > 0 ? (
            contenidosCurriculares.map((contenido) => (
              <ContenidoCurricularItem
                key={contenido.id}
                contenidoCurricular={contenido}
                onEdit={handleEditContenido}
                onDelete={handleDeleteContenido}
                onAddEje={handleAddEje}
                onEditEje={handleEditEje}
                onDeleteEje={handleDeleteEje}
              />
            ))
          ) : (
            <div className="text-center py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No hay Contenidos Curriculares</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Aún no se han agregado contenidos curriculares.</p>
            </div>
          )}
        </div>
      </main>

      <ContenidosCurricularesModal
        isOpen={isContenidoModalOpen}
        onClose={handleCloseContenidoModal}
        contenidoCurricular={selectedContenido}
        areas={areas}
      />

      <EjeTematicoModal
        isOpen={isEjeModalOpen}
        onClose={handleCloseEjeModal}
        contenidoCurricularId={selectedContenidoId}
        ejeTematico={selectedEje}
      />
    </div>
  )
}
