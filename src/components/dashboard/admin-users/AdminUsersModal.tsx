'use client'; 

import { Fragment, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { UpsertUserSchema, UpsertUserType, UserType } from '@/src/lib/schemas/user.schema';
import { upsertUser } from '@/src/lib/actions/user.action';
import { Role } from '@/src/generated/prisma';

interface AdminUsersModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit' | 'view';
  user: UserType | null;
  onClose: () => void;
}

const defaultValues: UpsertUserType = {
  firstName: '',
  lastName: '',
  email: '',
  role: Role.USER,
  isActive: true,
};

export default function AdminUsersModal({ isOpen, mode, user, onClose }: AdminUsersModalProps) {

  const isViewMode = mode === 'view';

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UpsertUserType>({
    resolver: zodResolver(UpsertUserSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' || mode === 'view') {
        reset(user as UpsertUserType);
      } else {
        reset(defaultValues);
      }
    }
  }, [isOpen, mode, user, reset]);

  const onSubmit = async (data: UpsertUserType) => {
    const result = await upsertUser(data);
    if (result.success) {
      toast.success(mode === 'add' ? 'Usuario agregado exitosamente' : 'Usuario actualizado exitosamente');
      onClose();
    } else {
      if (result.error) {
        // Handle specific field errors
        if ('email' in result.error && result.error.email) {
          toast.error(result.error.email[0]);
        } else if ('_form' in result.error && result.error._form) {
          toast.error(result.error._form[0]);
        } else {
          toast.error('Ocurrió un error.');
        }
      } else {
        toast.error('Ocurrió un error inesperado.');
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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

                {isViewMode ? (
                  <div className="mt-4 space-y-2">
                    <p><strong>ID:</strong> {user?.id}</p>
                    <p><strong>Nombre:</strong> {user?.firstName} {user?.lastName}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Rol:</strong> {user?.role}</p>
                    <p><strong>Activo:</strong> {user?.isActive ? 'Sí' : 'No'}</p>
                    <p><strong>Creado:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Nombre</label>
                      <input {...register('firstName')} id="firstName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm p-2" />
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Apellido</label>
                      <input {...register('lastName')} id="lastName" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm p-2" />
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input {...register('email')} id="email" type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm p-2" />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
                      <select {...register('role')} id="role" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm p-2">
                        {Object.values(Role).map(role => <option key={role} value={role}>{role}</option>)}
                      </select>
                      {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>}
                    </div>
                    <div className="flex items-center">
                      <input {...register('isActive')} id="isActive" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Activo</label>
                    </div>
                    {errors.isActive && <p className="mt-1 text-sm text-red-600">{errors.isActive.message}</p>}

                    <div className="mt-6 flex justify-end space-x-2">
                      <button type="button" onClick={onClose} className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Cancelar
                      </button>
                      <button type="submit" disabled={isSubmitting} className="rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50">
                        {isSubmitting ? 'Guardando...' : (mode === 'add' ? 'Agregar' : 'Guardar Cambios')}
                      </button>
                    </div>
                  </form>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
