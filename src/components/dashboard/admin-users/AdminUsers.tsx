'use client';

import { useState } from 'react';
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import type { User } from '@/src/generated/prisma';
import AdminUsersModal from './AdminUsersModal';
import { UserForAdminType } from '@/src/lib/schemas/user.schema';

// Creamos un tipo local para los usuarios que evite filtrar el password


interface AdminUsersProps {
  users: UserForAdminType[];
}

export default function AdminUsers({ users: initialUsers }: AdminUsersProps) {
  const [users, setUsers] = useState<UserForAdminType[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('view');
  const [selectedUser, setSelectedUser] = useState<UserForAdminType | null>(null);

  const openModal = (mode: 'add' | 'edit' | 'view', user: UserForAdminType | null = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = (user: UserForAdminType) => {
    if (modalMode === 'add') {
      // Aquí iría la lógica para llamar a un Server Action y crear el usuario en la BD
      console.log('Adding user:', user);
      // Simulando la adición en el cliente
      setUsers([user, ...users]);
    } else {
      // Aquí iría la lógica para llamar a un Server Action y actualizar el usuario
      console.log('Editing user:', user);
      // Simulando la edición en el cliente
      setUsers(users.map((u) => (u.id === user.id ? user : u)));
    }
    closeModal();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      // Aquí iría la lógica para llamar a un Server Action y eliminar el usuario
      console.log('Deleting user:', userId);
      // Simulando la eliminación en el cliente
      setUsers(users.filter((u) => u.id !== userId));
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Usuarios</h1>
          <p className="mt-2 text-sm text-gray-700">
            Una lista de todos los usuarios en el sistema.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => openModal('add')}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            <UserPlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Agregar Usuario
          </button>
        </div>
      </div>
      <div className="-mx-4 mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:-mx-6 md:mx-0 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nombre</th>
              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">Email</th>
              <th scope="col" className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">Rol</th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estado</th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-6">
                  {user.name}
                  <dl className="font-normal lg:hidden">
                    <dt className="sr-only">Email</dt>
                    <dd className="mt-1 truncate text-gray-700">{user.email}</dd>
                  </dl>
                </td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">{user.email}</td>
                <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">{user.rol}</td>
                <td className="px-3 py-4 text-sm text-gray-500">
                    {user.isActived ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Activo</span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Inactivo</span>
                    )}
                </td>
                <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <div className="flex justify-end space-x-2">
                    <button onClick={() => openModal('view', user)} className="text-indigo-600 hover:text-indigo-900">
                        <EyeIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => openModal('edit', user)} className="text-yellow-600 hover:text-yellow-900">
                        <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                        <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modal */}
      <AdminUsersModal 
        isOpen={isModalOpen}
        mode={modalMode}
        user={selectedUser}
        onClose={closeModal}
        onSave={handleSaveUser}
      />
    </div>
  );
}
