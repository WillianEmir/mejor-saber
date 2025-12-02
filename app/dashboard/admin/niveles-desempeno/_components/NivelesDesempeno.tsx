'use client';

import { useState, useTransition } from 'react'; 
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

import { deleteNivelDesempeno } from '../_lib/NivelesDesempeno.actions';
import { NivelDesempenoType } from '../_lib/NivelesDesempeno.schema';
import { Areatype } from '../../areas/_lib/area.schema';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import { Button } from '@/src/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog';
import NivelDesempenoModal from './NivelDesempenoModal';

interface NivelesDesempenoProps {
  niveles: NivelDesempenoType[];
  areas: Areatype[];
}

export default function NivelesDesempeno({ niveles, areas }: NivelesDesempenoProps) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNivel, setSelectedNivel] = useState<NivelDesempenoType | null>(null);
  const [areaFilter, setAreaFilter] = useState('all');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition(); 

  const handleEdit = (nivel: NivelDesempenoType) => {
    setSelectedNivel(nivel);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {

    if (!deletingId) return;

    startTransition(async () => {
      const result = await deleteNivelDesempeno(deletingId);
      if (result?.success) {
        toast.success(result.message);
      } else {
        toast.error(result?.message || 'Algo salió mal');
      }
      setIsConfirmOpen(false);
      setDeletingId(null);
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNivel(null);
  }

  const filteredNiveles = niveles.filter(
    (nivel) => areaFilter === 'all' || nivel.areaId === areaFilter
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Niveles de Desempeño</CardTitle>
        <div className="flex justify-between">
          <div>
            <Button onClick={() => setIsModalOpen(true)}>Crear Nivel</Button>
          </div>
          <div className="w-1/4">
            <Select value={areaFilter} onValueChange={setAreaFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las áreas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Área</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Nivel</TableHead>
              <TableHead>Min</TableHead>
              <TableHead>Max</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNiveles.map((nivel) => (
              <TableRow key={nivel.id}>
                <TableCell>{nivel.area.nombre}</TableCell>
                <TableCell>{nivel.descripcion}</TableCell>
                <TableCell>{nivel.nivel}</TableCell>
                <TableCell>{nivel.puntajeMin}</TableCell>
                <TableCell>{nivel.puntajeMax}</TableCell>
                <TableCell className='flex'>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(nivel)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(nivel.id)}
                    className="ml-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      
      <NivelDesempenoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        nivel={selectedNivel}
        areas={areas}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description="¿Estás seguro de que deseas eliminar este nivel de desempeño? Esta acción no se puede deshacer."
        isPending={isPending}
      />
    </Card>
  );
}