'use client';

import { useState, useTransition } from 'react';  
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';

import { deleteSchool } from '@/app/dashboard/admin/schools/_lib/school.actions';
import { deleteSchoolSede } from '../../_lib/sede.actions';
import { SchoolWithSedesType, SchoolType } from '@/app/dashboard/admin/schools/_lib/school.schema';
import { SchoolSedeType } from '../../_lib/sede.schema';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Button } from '@/src/components/ui/Button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/src/components/ui/accordion';
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog';
import SchoolModal from './SchoolModal';
import SedeModal from '../sede/SedeModal';
 
import { MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/components/ui/dropdown-menu';

interface AdminSchoolsProps {
  schools: SchoolWithSedesType[];
}

export default function SchoolList({ schools }: AdminSchoolsProps) {
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isSedeModalOpen, setIsSedeModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | undefined>(undefined);
  const [selectedSede, setSelectedSede] = useState<SchoolSedeType | undefined>(undefined);
  const [selectedSchoolForSede, setSelectedSchoolForSede] = useState<string | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<'school' | 'sede' | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenSchoolModal = (school?: SchoolType) => {
    setSelectedSchool(school);
    setIsSchoolModalOpen(true);
  };

  const handleCloseSchoolModal = () => {
    setIsSchoolModalOpen(false);
    setSelectedSchool(undefined);
  };

  const handleOpenSedeModal = (schoolId: string, sede?: SchoolSedeType) => {
    setSelectedSchoolForSede(schoolId);
    setSelectedSede(sede);
    setIsSedeModalOpen(true);
  };

  const handleCloseSedeModal = () => {
    setIsSedeModalOpen(false);
    setSelectedSede(undefined);
    setSelectedSchoolForSede(undefined);
  };

  const handleDelete = (id: string, type: 'school' | 'sede') => {
    setDeletingId(id);
    setDeleteType(type);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingId || !deleteType) return;

    const action = deleteType === 'school' ? deleteSchool : deleteSchoolSede;

    startTransition(async () => {
      const result = await action(deletingId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message || 'Algo salió mal');
      }
      setIsConfirmOpen(false);
      setDeletingId(null);
      setDeleteType(null);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instituciones Educativas</CardTitle>
        <div className="flex justify-end">
          <Button onClick={() => handleOpenSchoolModal()}>Crear Institución</Button>
        </div>
      </CardHeader>

      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {schools.map((school) => (
            <AccordionItem value={school.id} key={school.id}>
              <div className="flex items-center w-full px-4">
                <div className='w-full'>
                  <AccordionTrigger className="flex-grow text-left text-lg font-semibold">
                    {school.nombre}
                    {school.maxUsers && <span className="ml-2 text-sm text-gray-500">({school.maxUsers} usuarios)</span>}
                  </AccordionTrigger>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleOpenSchoolModal(school)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(school.id, 'school')}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <AccordionContent>
                <div className="px-4 pb-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-semibold text-gray-700">Sedes</h3>
                    <Button variant="outline" size="sm" onClick={() => handleOpenSedeModal(school.id)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir Sede
                    </Button>
                  </div>
                  {school.sedes && school.sedes.length > 0 ? (
                    <ul className="space-y-2">
                      {school.sedes.map((sede) => (
                        <li key={sede.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md border">
                          <div>
                            <p className="font-medium text-gray-800">{sede.nombre}</p>
                            <p className="text-xs text-gray-500">DANE: {sede.DANE}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleOpenSedeModal(school.id, sede)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                <span>Editar</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(sede.id, 'sede')}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Eliminar</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-center text-gray-500 py-4">No hay sedes registradas.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>

      <SchoolModal
        school={selectedSchool}
        isOpen={isSchoolModalOpen}
        onClose={handleCloseSchoolModal}
      />

      <SedeModal
        schoolId={selectedSchoolForSede}
        sede={selectedSede}
        isOpen={isSedeModalOpen}
        onClose={handleCloseSedeModal}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title={`Confirmar Eliminación de ${deleteType === 'school' ? 'Institución' : 'Sede'}`}
        description={`¿Estás seguro de que deseas eliminar est${deleteType === 'school' ? 'a institución' : 'a sede'}? Esta acción no se puede deshacer.`}
        isPending={isPending}
      />
    </Card>
  );
}