'use client'

import React, { Fragment, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { AreaModal } from './AreaModal';
import { CompetenciaModal } from './CompetenciaModal';
import { AfirmacionModal } from './AfirmacionModal';
import { EvidenciaModal } from './EvidenciaModal';
import { AccordionRow } from './AccordionRow';

// --- Tipos y Datos (Sin cambios) ---
type Area = { id: string; nombre: string; };
type Competencia = { id: string; nombre: string; areaId: string; };
type Afirmacion = { id: string; nombre: string; competenciaId: string; };
type Evidencia = { id: string; nombre: string; afirmacionId: string; };

const areas: Area[] = [
  { id: 'area-1', nombre: 'Matemáticas' },
  { id: 'area-2', nombre: 'Lectura Crítica' },
];
const competencias: Competencia[] = [
  { id: 'comp-1', nombre: 'Interpretación y representación', areaId: 'area-1' },
  { id: 'comp-2', nombre: 'Formulación y ejecución', areaId: 'area-1' },
  { id: 'comp-3', nombre: 'Identificar y entender los contenidos locales que conforman un texto', areaId: 'area-2' },
];
const afirmaciones: Afirmacion[] = [
  { id: 'afir-1', nombre: 'Comprende y transforma la información cuantitativa...', competenciaId: 'comp-1' },
  { id: 'afir-2', nombre: 'Plantea e implementa estrategias que lleven a soluciones adecuadas.', competenciaId: 'comp-2' },
];
const evidencias: Evidencia[] = [
  { id: 'evid-1', nombre: 'Da cuenta de las características básicas de la información...', afirmacionId: 'afir-1' },
  { id: 'evid-2', nombre: 'Transforma la representación de una o más piezas de información.', afirmacionId: 'afir-1' },
];
// --- Fin de Datos ---

export default function AdminAreasInteractivo() {

  // Estado para controlar qué elementos del acordeón están abiertos
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(['area-1']));

  // Función para abrir/cerrar un elemento
  const handleToggle = (id: string) => {
    setOpenItems(prevOpenItems => {
      const newOpenItems = new Set(prevOpenItems);
      if (newOpenItems.has(id)) {
        newOpenItems.delete(id);
      } else {
        newOpenItems.add(id);
      }
      return newOpenItems;
    });
  };

  // --- State and Handlers for AreaModal ---
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<Area | null>(null);

  const handleOpenAreaModalForAdd = () => {
    setEditingArea(null);
    setIsAreaModalOpen(true);
  };

  const handleOpenAreaModalForEdit = (id: string) => {
    const areaToEdit = areas.find(a => a.id === id);
    if (areaToEdit) {
      setEditingArea(areaToEdit);
      setIsAreaModalOpen(true);
    }
  };

  const handleCloseAreaModal = () => {
    setIsAreaModalOpen(false);
    setEditingArea(null);
  };

  // --- State and Handlers for CompetenciaModal ---
  const [isCompetenciaModalOpen, setIsCompetenciaModalOpen] = useState(false);
  const [editingCompetencia, setEditingCompetencia] = useState<Competencia | null>(null);

  const handleOpenCompetenciaModalForAdd = () => {
    setEditingCompetencia(null);
    setIsCompetenciaModalOpen(true);
  };

  const handleOpenCompetenciaModalForEdit = (id: string) => {
    const competenciaToEdit = competencias.find(a => a.id === id);
    if (competenciaToEdit) {
      setEditingCompetencia(competenciaToEdit);
      setIsCompetenciaModalOpen(true);
    }
  };

  const handleCloseCompetenciaModal = () => {
    setIsCompetenciaModalOpen(false);
    setEditingCompetencia(null);
  };

  const handleCompetenciaSubmit = (data: { nombre: string; areaId: string; id?: string }) => {
    if (data.id) {
      console.log('Actualizando Competencia:', data);
      // Aquí iría la lógica para actualizar el estado `areas`
    } else {
      // console.log('Creando nueva Competencia:', { ...data, id: `area-${Date.now()}` });
      // Aquí iría la lógica para agregar al estado `areas`
    }
    handleCloseCompetenciaModal();
  };

  // --- State and Handlers for AfirmacionModal ---
  const [isAfirmacionModalOpen, setIsAfirmacionModalOpen] = useState(false);
  const [editingAfirmacion, setEditingAfirmacion] = useState<Afirmacion | null>(null);

  const handleOpenAfirmacionModalForAdd = () => {
    setEditingAfirmacion(null);
    setIsAfirmacionModalOpen(true);
  };

  const handleOpenAfirmacionModalForEdit = (id: string) => {
    const afirmacionToEdit = afirmaciones.find(a => a.id === id);

    if (afirmacionToEdit) {
      setEditingAfirmacion(afirmacionToEdit);
      setIsAfirmacionModalOpen(true);
    }
  };

  const handleCloseAfirmacionModal = () => {
    setIsAfirmacionModalOpen(false);
    setEditingAfirmacion(null);
  };

  const handleAfirmacionSubmit = (data: { nombre: string; competenciaId: string; id?: string }) => {
    if (data.id) {
      console.log('Actualizando Afirmación:', data);
      // Aquí iría la lógica para actualizar el estado `areas`
    } else {
      // console.log('Creando nueva Competencia:', { ...data, id: `area-${Date.now()}` });
      // Aquí iría la lógica para agregar al estado `areas`
    }
    handleCloseAfirmacionModal();
  };

  // --- State and Handlers for EvidenciaModal ---
  const [isEvidenciaModalOpen, setIsEvidenciaModalOpen] = useState(false);
  const [editingEvidencia, setEditingEvidencia] = useState<Evidencia | null>(null);

  const handleOpenEvidenciaModalForAdd = () => {
    setEditingEvidencia(null);
    setIsEvidenciaModalOpen(true);
  };

  const handleOpenEvidenciaModalForEdit = (id: string) => {
    const evidenciaToEdit = evidencias.find(a => a.id === id);

    if (evidenciaToEdit) {
      setEditingEvidencia(evidenciaToEdit);
      setIsEvidenciaModalOpen(true);
    }
  };

  const handleCloseEvidenciaModal = () => {
    setIsEvidenciaModalOpen(false);
    setEditingEvidencia(null);
  };

  const handleEvidenciaSubmit = (data: { nombre: string; afirmacionId: string; id?: string }) => {
    if (data.id) {
      console.log('Actualizando Afirmación:', data);
      // Aquí iría la lógica para actualizar el estado `areas`
    } else {
      // console.log('Creando nueva Competencia:', { ...data, id: `area-${Date.now()}` });
      // Aquí iría la lógica para agregar al estado `areas`
    }
    handleCloseEvidenciaModal();
  };

  // --- Placeholder Handlers for other actions ---
  const handleEdit = (type: string) => (id: string) => {
    if (type === 'Área') {
      handleOpenAreaModalForEdit(id);
    } else if (type === 'Competencia') {
      console.log(`Editar ${type}: ${id}`);
      handleOpenCompetenciaModalForEdit(id);
    } else if (type === 'Afirmación') {
      handleOpenAfirmacionModalForEdit(id);
    } else if (type === 'Evidencia') {
      handleOpenEvidenciaModalForEdit(id);
    } else {
      console.log(`Editar ${type}: ${id}`);
    }
  };

  const handleAddChild = (type: string) => (parentId: string) => {
    if (type === 'Competencia') {
      handleOpenCompetenciaModalForAdd();
    } else if (type === 'Afirmación') {
      handleOpenAfirmacionModalForAdd();
    } else if (type === 'Evidencia') {
      handleOpenEvidenciaModalForAdd();
    }
  }
  const handleDelete = (type: string) => (id: string) => console.log(`Eliminar ${type}: ${id}`);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* --- Encabezado General --- */}
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
            Estructura Académica
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Expande cada elemento para ver y gestionar su contenido.
          </p>
        </div>

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={handleOpenAreaModalForAdd}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className="w-5 h-5 -ml-0.5" />
            Agregar Área
          </button>
        </div>
      </div>

      {/* --- Tabla Jerárquica Interactiva --- */}
      <div className="mt-8 flow-root">
        <div className="min-w-full overflow-hidden border border-gray-200 rounded-lg shadow-sm dark:border-gray-700">
          {areas.map(area => {
            const areaCompetencias = competencias.filter(c => c.areaId === area.id);
            const isOpen = openItems.has(area.id);
            return (
              <Fragment key={area.id}>
                <AccordionRow
                  item={area}
                  level={0}
                  hasChildren={areaCompetencias.length > 0}
                  isOpen={isOpen}
                  childType="Competencia"
                  onToggle={handleToggle}
                  onAddChild={handleAddChild('Competencia')}
                  onEdit={handleEdit('Área')}
                  onDelete={handleDelete('Área')}
                />
                {isOpen && areaCompetencias.map(competencia => {
                  const compAfirmaciones = afirmaciones.filter(af => af.competenciaId === competencia.id);
                  const isCompOpen = openItems.has(competencia.id);
                  return (
                    <Fragment key={competencia.id}>
                      <AccordionRow
                        item={competencia}
                        level={1}
                        hasChildren={compAfirmaciones.length > 0}
                        isOpen={isCompOpen}
                        childType="Afirmación"
                        onToggle={handleToggle}
                        onAddChild={handleAddChild('Afirmación')}
                        onEdit={handleEdit('Competencia')}
                        onDelete={handleDelete('Competencia')}
                      />
                      {isCompOpen && compAfirmaciones.map(afirmacion => {
                        const afirEvidencias = evidencias.filter(ev => ev.afirmacionId === afirmacion.id);
                        const isAfirOpen = openItems.has(afirmacion.id);
                        return (
                          <Fragment key={afirmacion.id}>
                            <AccordionRow
                              item={afirmacion}
                              level={2}
                              hasChildren={afirEvidencias.length > 0}
                              isOpen={isAfirOpen}
                              childType="Evidencia"
                              onToggle={handleToggle}
                              onAddChild={handleAddChild('Evidencia')}
                              onEdit={handleEdit('Afirmación')}
                              onDelete={handleDelete('Afirmación')}
                            />
                            {isAfirOpen && afirEvidencias.map(evidencia => (
                              <AccordionRow
                                key={evidencia.id}
                                item={evidencia}
                                level={3}
                                hasChildren={false}
                                isOpen={false}
                                onToggle={() => { }}
                                onAddChild={() => { }}
                                onEdit={handleEdit('Evidencia')}
                                onDelete={handleDelete('Evidencia')}
                              />
                            ))}
                          </Fragment>
                        )
                      })}
                    </Fragment>
                  );
                })}
              </Fragment>
            );
          })}
        </div>
      </div>

      <AreaModal
        isOpen={isAreaModalOpen}
        onClose={handleCloseAreaModal}
        initialData={editingArea}
      />

      <CompetenciaModal
        areas={[]}
        isOpen={isCompetenciaModalOpen}
        onClose={handleCloseCompetenciaModal}
        onSubmit={handleCompetenciaSubmit}
        initialData={editingCompetencia}
      />

      <AfirmacionModal
        competencias={[]}
        isOpen={isAfirmacionModalOpen}
        onClose={handleCloseAfirmacionModal}
        onSubmit={handleAfirmacionSubmit}
        initialData={editingAfirmacion}
      />

      <EvidenciaModal
        afirmaciones={[]}
        isOpen={isEvidenciaModalOpen}
        onClose={handleCloseEvidenciaModal}
        onSubmit={handleEvidenciaSubmit}
        initialData={editingEvidencia}
      />
    </div>
  );
}