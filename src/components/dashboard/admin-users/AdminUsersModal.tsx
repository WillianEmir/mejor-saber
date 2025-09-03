'use client';

import { Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { UserForAdmin } from './AdminUsers';

interface AdminUsersModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'view';
  user: UserForAdmin | null;
  onClose: () => void;
  onSave: (user: UserForAdmin) => void;
}

export default function AdminUsersModal({ isOpen, mode, user, onClose, onSave }: AdminUsersModalProps) {
  const isViewMode = mode === 'view';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      id: user?.id || new Date().toISOString(), // Generar ID para nuevos usuarios
      ...Object.fromEntries(formData.entries()),
      // Asegurarse de que los tipos de datos correctos se pasen si es necesario
      isActived: formData.get('isActived') === 'true',
    } as unknown as UserForAdmin;

    onSave(userData);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center">
                  {mode === 'add' && 'Agregar Usuario'}
                  {mode === 'edit' && 'Editar Usuario'}
                  {mode === 'view' && 'Detalles del Usuario'}
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </DialogTitle>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {isViewMode ? (
                    <div className="space-y-2">
                      <p><strong>ID:</strong> {user?.id}</p>
                      <p><strong>Nombre:</strong> {user?.firstName} {user?.lastName}</p>
                      <p><strong>Email:</strong> {user?.email}</p>
                      <p><strong>Rol:</strong> {user?.rol}</p>
                      <p><strong>Activo:</strong> {user?.isActived ? 'Sí' : 'No'}</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" name="firstName" id="firstName" defaultValue={user?.firstName || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
                        <input type="text" name="lastName" id="lastName" defaultValue={user?.lastName || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" id="email" defaultValue={user?.email || ''} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
                      </div>
                      <div>
                        <label htmlFor="rol" className="block text-sm font-medium text-gray-700">Rol</label>
                        <select name="rol" id="rol" defaultValue={user?.rol || 'USER'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                          <option value="USER">User</option>
                          <option value="ADMIN">Admin</option>
                        </select>
                      </div>
                       <div>
                        <label htmlFor="isActived" className="block text-sm font-medium text-gray-700">Estado</label>
                        <select name="isActived" id="isActived" defaultValue={user?.isActived ? 'true' : 'false'} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                          <option value="true">Activo</option>
                          <option value="false">Inactivo</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="mt-6 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      Cancelar
                    </button>
                    {!isViewMode && (
                      <button type="submit" className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        {mode === 'add' ? 'Agregar' : 'Guardar Cambios'}
                      </button>
                    )}
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}