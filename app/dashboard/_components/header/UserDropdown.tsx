'use client';

import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';

function getInitials(
  name?: string,
  lastName?: string | null,
  email?: string | null | undefined,
) {
  const firstInitial = name?.[0] || '';
  const lastInitial = lastName?.[0] || '';

  if (firstInitial && lastInitial) {
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }
  if (name) {
    return name.substring(0, 2).toUpperCase();
  }
  if (email) {
    return email.substring(0, 2).toUpperCase();
  }
  return 'U'; // Default initial if no name or email
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
  const initials = getInitials(user.name, user.lastName, user.email);
  const displayName = user.name || 'Usuario';
  const fullName = `${user.name || ''} ${user.lastName || ''}`.trim() || 'Usuario';

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="flex items-center justify-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 cursor-pointer">
          <div className="relative h-11 w-11">
            {user.image ? (
              <Image
                src={user.image}
                alt="User image"
                fill
                sizes="44px"
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                <span className="text-base font-semibold">{initials}</span>
              </div>
            )}
          </div>

          <span className="hidden font-medium text-gray-700 dark:text-gray-300 lg:block">
            {displayName}
          </span>

          <ChevronDown
            className="hidden h-5 w-5 stroke-gray-500 transition-transform duration-200 open:rotate-180 dark:stroke-gray-400 lg:block"
            aria-hidden="true"
          />
        </MenuButton>

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
        <MenuItems className="absolute right-0 mt-2 w-64 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-md focus:outline-none dark:bg-neutral-dark dark:divide-neutral-light dark:shadow-neutral-light dark:text-neutral-light">
          <div className="px-4 py-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {fullName}
            </p>
            <p className="truncate text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
          <div className="py-1">
            <MenuItem>
              {({ active }) => (
                <Link
                  href="/dashboard/profile"
                  className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300`}
                >
                  <UserCircle className="h-5 w-5" />
                  Editar Perfil
                </Link>
              )}
            </MenuItem>
          </div>
          <div className="py-1">
            <MenuItem>
              {({ active }) => (
                <button
                  onClick={handleSignOut}
                  className={`${active ? 'bg-gray-100 dark:bg-gray-700' : ''} group flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer`}
                >
                  <LogOut className="h-5 w-5" />
                  Cerrar Sesión
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </Transition>
    </Menu>
  );
}