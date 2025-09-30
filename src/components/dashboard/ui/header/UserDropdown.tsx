'use client'; 

import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { KeyRound, LogOut, UserCircle } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';

function getInitials(firstName?: string, lastName?: string | null) {
  const firstInitial = firstName?.[0] || '';
  const lastInitial = lastName?.[0] || '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export default function UserDropdown() { 
  const { data: session } = useSession();

  async function handleSignOut() {
    await signOut({
      callbackUrl: '/auth/signin',
    });
  }

  if (!session) {
    return null; 
  }

  const { user } = session;
  const initials = getInitials(user.firstName, user.lastName);  

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center justify-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
          <div className="relative h-11 w-11">
            {user.avatar ? (
              <Image
                width={44}
                height={44}
                src={user.avatar}
                alt="User Avatar"
                className="rounded-full"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                <span className="text-base font-semibold">{initials}</span>
              </div>
            )}
          </div>
          <span className="hidden font-medium text-gray-700 dark:text-gray-300 lg:block">
            {user.firstName}
          </span>
          <svg
            className="hidden stroke-gray-500 transition-transform duration-200 ui-open:rotate-180 dark:stroke-ray-400 lg:block"
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:divide-gray-700">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user.firstName} {user.lastName || ''}
            </p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/dashboard/profile"
                  className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300`}
                >
                  <UserCircle className="h-5 w-5" />
                  Editar Perfil
                </Link>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleSignOut}
                  className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300`}
                >
                  <LogOut className="h-5 w-5" />
                  Cerrar Sesión
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
