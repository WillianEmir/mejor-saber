
'use client';

import { useState, useTransition } from 'react';
import { SchoolSede } from '@/src/generated/prisma';
import { Card, CardHeader, CardTitle, CardContent } from '@/src/components/ui/card';
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '@/src/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteUser } from '../_lib/actions';
import UserModal from './UserModal';
import { Button } from '@/src/components/ui/Button';
import { UserSchoolType } from '../_lib/school.schema';

interface UserManagementProps { 
  initialUsers: UserSchoolType[]; 
  sedes: SchoolSede[];
}

export default function UserManagement({ initialUsers, sedes }: UserManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSchoolType | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenModal = (user?: UserSchoolType) => {
    setSelectedUser(user); 
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(undefined);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingId) return;

    startTransition(async () => {
      const result = await deleteUser(deletingId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      setIsConfirmOpen(false);
      setDeletingId(null);
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Usuarios de la Institución</CardTitle>
        <Button onClick={() => handleOpenModal()}>Crear Usuario</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grado</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sede</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {initialUsers.map((user) => {
                const sedeName = sedes.find(sede => sede.id === user.schoolSedeId)?.nombre || 'N/A';
                return (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{user.name} {user.lastName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{user.degree?.toUpperCase() || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{sedeName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleOpenModal(user)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(user.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>

      <UserModal
        user={selectedUser}
        schoolId={initialUsers[0]?.schoolId || ''}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        sedes={sedes}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description="¿Estás seguro de que deseas eliminar este usuario?"
        isPending={isPending}
      />
    </Card>
  );
}
