'use client';

import { useState, useTransition } from 'react'; // Import useTransition
import Link from 'next/link';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '@/src/components/ui/Button';
import { SimulacroOficialModal } from './SimulacroOficialModal';
import { SimulacroOficialValues } from '../_lib/schema';
import { toast } from 'sonner';
import { deleteSimulacroOficial, toggleSimulacroOficialStatus } from '../_lib/actions'; // Import the new action
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog'; // Import ConfirmationDialog
import { Switch } from '@/src/components/ui/switch'; // Import Switch

// This type should be derived from what getOfficialSimulacrosBySchoolId returns
export type SimulacroOficialWithArea = {
  id: string;
  nombre: string;
  habilitado: boolean; // Added
  area: {
    id: string; // Now includes id
    nombre: string;
  };
};

interface SimulacrosOficialesClientProps {
  simulacros: SimulacroOficialWithArea[];
  areas: { id: string; nombre: string }[];
}

export function SimulacrosOficialesClient({ simulacros, areas }: SimulacrosOficialesClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSimulacro, setSelectedSimulacro] = useState<SimulacroOficialValues | null>(null);

  // State for confirmation dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [simulacroToDeleteId, setSimulacroToDeleteId] = useState<string | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition(); // For pending state of deletion
  const [isToggling, startToggleTransition] = useTransition(); // For pending state of toggling

  const handleOpenModal = (simulacro: SimulacroOficialWithArea | null = null) => {
    if (simulacro) {
        const values: SimulacroOficialValues = {
            id: simulacro.id,
            nombre: simulacro.nombre,
            areaId: simulacro.area.id, // Use simulacro.area.id
        };
        setSelectedSimulacro(values);
    } else {
        setSelectedSimulacro(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSimulacro(null);
  };
  
  const handleDeleteClick = (id: string) => {
    setSimulacroToDeleteId(id);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = () => {
    if (simulacroToDeleteId) {
      startDeleteTransition(async () => {
        const result = await deleteSimulacroOficial(simulacroToDeleteId);
        if (result.success) {
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
        setShowConfirmDialog(false);
        setSimulacroToDeleteId(null);
      });
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setSimulacroToDeleteId(null);
  };

  const handleToggleChange = (simulacroId: string, currentStatus: boolean) => {
    startToggleTransition(async () => {
      const result = await toggleSimulacroOficialStatus(simulacroId, !currentStatus);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };


  return (
    <>
      <SimulacroOficialModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        areas={areas}
        simulacro={selectedSimulacro}
      />

      <ConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        description="¿Estás seguro de que quieres eliminar este simulacro oficial? Esta acción no se puede deshacer."
        isPending={isDeleting}
      />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Simulacros Oficiales</h1>
        <Button onClick={() => handleOpenModal()}>
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Programar Nuevo Simulacro
        </Button>
      </div>

      <div className="mt-6">
        {simulacros.length === 0 ? (
          <p>No hay simulacros oficiales programados para tu escuela.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Nombre</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Área</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Estado</th>
                  <th className="py-2 px-4 text-left text-sm font-semibold text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {simulacros.map((simulacro) => (
                  <tr key={simulacro.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-800">{simulacro.nombre}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{simulacro.area.nombre}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      <Switch
                        checked={simulacro.habilitado}
                        onCheckedChange={() => handleToggleChange(simulacro.id, simulacro.habilitado)}
                        disabled={isToggling}
                      />
                      <span className="ml-2">
                        {simulacro.habilitado ? 'Habilitado' : 'Deshabilitado'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 flex items-center gap-2">
                      <Link href={`/dashboard/school/simulacros-oficiales/${simulacro.id}/resultados`} className="text-blue-600 hover:underline">
                        Ver Resultados
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleOpenModal(simulacro)}>
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(simulacro.id)}>
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

