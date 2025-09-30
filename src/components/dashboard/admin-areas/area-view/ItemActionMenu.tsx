'use client'

import { Menu, Transition } from '@headlessui/react'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Fragment } from 'react'

interface ItemActionMenuProps { 
  onEdit: () => void
  onDelete: () => void
}

export default function ItemActionMenu({ onEdit, onDelete }: ItemActionMenuProps) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md p-1 text-sm font-medium text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
          <MoreVertical className="h-5 w-5" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 dark:divide-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none z-10">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onEdit}
                  className={`${
                    active ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-200'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                  Editar
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onDelete}
                  className={`${
                    active ? 'bg-red-500 text-white' : 'text-red-600'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Eliminar
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
