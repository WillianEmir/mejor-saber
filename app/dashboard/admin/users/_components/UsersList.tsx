'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';

import { deleteUser } from '@/app/dashboard/admin/users/_lib/user.action';
import { UserType } from '@/app/dashboard/admin/users/_lib/user.schema';

import { Button } from '@/src/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ClientDateTime } from '@/app/dashboard/admin/users/_components/ClientDateTime';
import { ConfirmationDialog } from '@/src/components/ui/ConfirmationDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/src/components/ui/table';
import UsersModal from './UsersModal';

interface AdminUsersProps {  
  users: UserType[];
  schools: { id: string; nombre: string }[];
}

export default function UsersList({ users, schools }: AdminUsersProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | undefined>(undefined);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenModal = (user?: UserType) => {
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
      <CardHeader>
        <CardTitle>Usuarios</CardTitle>
        <div className="flex justify-end">
          <Button onClick={() => handleOpenModal()}>Crear Usuario</Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden md:table-cell">Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Último Login</TableHead>
                <TableHead><span className="sr-only">Acciones</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{`${user.name} ${user.lastName && user.lastName !== 'null' ? user.lastName : ''}`}</TableCell>
                  <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.role}</TableCell>
                  <TableCell>
                    {user.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Activo</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Inactivo</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.lastLogin
                      ? <ClientDateTime date={user.lastLogin} />
                      : 'Nunca'}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <UsersModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        schools={schools}
      />

      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación de Usuario"
        description="¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer."
        isPending={isPending}
      />
    </Card>
  );
}
