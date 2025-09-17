'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Precios', href: '/precios' },
  { name: 'Preguntas Frecuentes', href: '/faq' },
  { name: 'Contacto', href: '/contacto' },
  { name: 'Términos y Condiciones', href: '/terminos' }
]

export default function TopMenu() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pathname = usePathname()
  

  return (
    <>
      <div className='h-[81px] lg:h-[88px]'></div>
      <header className="fixed inset-x-0 top-0 z-50 bg-white shadow">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">

          {/* LOGO */}
          <div className="flex lg:flex-1">
            <Link href='/' className="-m-1.5 p-1.5 flex justify-center items-center">
              <span className="pl-3 text-2xl font-bold text-(--color-principal)">SABER YA!</span>
            </Link>
          </div>

          {/* BOTÓN ABRIR MENÚ HAMBURGUESA*/}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="size-6" />
            </button>
          </div>

          {/* BOTONES DEL MENÚ DE NAVEGACIÓN */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link 
                key={item.name}
                href={item.href} 
                className={`${pathname === item.href ? 'text-(--color-principal)' : 'text-gray-900'} text-sm/6 font-semibold`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* BOTÓN CTA PRINCIPAL */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href="/dashboard"
              className="rounded-md bg-(--color-principal) px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-(--color-principal-hover) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-principal)"
            >
              Empieza Gratis
            </Link>
          </div>
        </nav>

        {/* MENÚ MOVIL */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">

              {/* LOGO */}
              <Link href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">SABER YA!</span>
              </Link>

              {/* BOTÓN CERRAR MENÚ HAMBURGUESA*/}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>
            </div>


            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">

                {/* MENÚ ITEMS MOVIL */}
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${pathname === item.href ? 'text-(--color-principal)' : 'text-gray-900'} -mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold hover:bg-gray-50`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* ENLACE DASHBOARD */}
                <div className="py-6">
                  <Link
                    href="/dashboard"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Empieza Gratis
                  </Link>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </>
  )
}
