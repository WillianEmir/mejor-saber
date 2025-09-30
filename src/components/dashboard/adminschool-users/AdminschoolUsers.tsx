'use client';

import { useState } from 'react';

import { UserType } from '@/src/lib/schemas/user.schema';
import { deleteUser } from '@/src/lib/actions/user.action';
import UserSchoolModal from './UserSchoolModal';
import { toast } from 'react-toastify';
import { Button } from '../../ui/Button';

interface AdminschoolUsersProps {
  users: UserType[] | null;
}

export default function AdminschoolUsers({ users: initialUsers }: AdminschoolUsersProps) {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | undefined>(undefined);

  const handleAddUser = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserType) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      const formData = new FormData();
      formData.append('id', userId);
      const result = await deleteUser(formData);
      if (result.success) {
        toast.success(result.message);
        setUsers(users?.filter(user => user.id !== userId) || null);
      } else {
        toast.error(result.message);
      }
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Usuarios de la Escuela
        </h4>
        <Button onClick={handleAddUser}>Agregar Usuario</Button>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Nombre</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Email</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Rol</h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">Acciones</h5>
          </div>
        </div>

        {users?.map((user, key) => (
          <div
            className={`grid grid-cols-4 sm:grid-cols-4 ${
              key === users.length - 1
                ? ''
                : 'border-b border-stroke dark:border-strokedark'
            }`}
            key={user.id}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <p className="hidden text-black dark:text-white sm:block">
                {user.firstName} {user.lastName}
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{user.email}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-5">{user.role}</p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5 space-x-2">
              <Button onClick={() => handleEditUser(user)}>Editar</Button>
              <Button onClick={() => handleDeleteUser(user.id)}>Eliminar</Button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <UserSchoolModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          user={selectedUser}
        />
      )}

    </div>
  );
}
