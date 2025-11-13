'use client'

import React, { useState, useEffect } from 'react'
import { LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { signOut } from 'next-auth/react'

import { ThemeToggleButton } from '@/src/components/ui/ThemeToggleButton'
import { Button } from '@/src/components/ui/Button'
import { useCurrentUser } from '@/src/hooks/use-current-user'
import { Skeleton } from '@/src/components/ui/skeleton'
import { redirectByRole } from '@/src/lib/utils.client'

const navigation = [
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Precios', href: '/precios' },
  { name: 'FAQ', href: '/preguntas-frecuentes' },
  { name: 'Contacto', href: '/contacto' },
]

export default function TopMenu() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status, } = useCurrentUser();
  
  const user = session?.user;
  const isLoggedIn = status === 'authenticated'


  const handleLogout = () => {
    signOut();
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    // Cleanup function to restore scroll on component unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* 1. Placeholder para el espacio fijo del header */}
      <div className="h-20"></div>

      {/* 2. HEADER FIJO */}
      <header className='fixed inset-x-0 top-0 z-sticky transition-colors bg-white/80 backdrop-blur-sm shadow-sm border-b border-neutral-light dark:bg-neutral-dark/80 dark:text-gray-100 dark:border-gray-700'>
        <nav className="container mx-auto flex h-20 items-center justify-between px-4 lg:px-8">

          {/* LOGO */}
          <div className="flex lg:flex-1">
            <Link href={'/'}>
              <Image
                src={'/logo.png'}
                alt='Logo'
                width={110}
                height={110}
                className='w-auto h-auto'
              />
            </Link>
          </div>

          {/* MOBILE MENU TRIGGER & THEME TOGGLE (Visible en móvil) */}
          <div className="flex items-center gap-4 lg:hidden">

            <ThemeToggleButton />

            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className='h-10 w-10 inline-flex items-center justify-center rounded-md border border-neutral-dark dark:border-neutral-light cursor-pointer'
              aria-label="Abrir menú principal"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="h-6 w-6 text-sm" />
            </button>
          </div>

          {/* DESKTOP NAVIGATION (Oculto en móvil) */}
          <div className="hidden lg:flex lg:gap-1 items-center">
            <ul className="flex gap-5 space-x-1">
              {navigation.map((item) => (
                <li
                  key={item.name}
                  className={`font-semibold text-md transition-colors hover:text-primary ${pathname === item.href ? 'text-primary dark:hover:text-primary-light' : 'text-foreground/90'}`}
                >
                  <Link href={item.href}>{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* DESKTOP CTA BUTTON & THEME TOGGLE (Oculto en móvil) */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">

            <ThemeToggleButton />

            {status === 'loading' && (
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-24 " />
                <Skeleton className="h-10 w-20 " />
                <Skeleton className="h-10 w-24 " />
              </div>
            )}

            {status === 'unauthenticated' && (
              <div className="flex items-center gap-2">
                <Link href='/auth/signup'>
                  <Button>Empezar Gratis</Button>
                </Link>
                <Link href='/auth/signin'>
                  <Button variant='outline'>Iniciar Sesión</Button>
                </Link>
              </div>
            )}

            {status === 'authenticated' && user && (
              <div className="flex items-center gap-4">
                <span className="font-semibold text-foreground/90">{`Hola, ${user.name}`}</span>
                <Button onClick={() => redirectByRole(session?.user?.role, router)}>
                  {isLoggedIn ? 'Ir al Dashboard' : 'Empezar Gratis Ahora'}
                </Button>
                <Button variant='outline' onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            )}

          </div>
        </nav>
      </header>

      {/* MOBILE MENU OVERLAY (Simulando Sheet/Drawer) */}
      <div className={`fixed inset-0 z-drawer lg:hidden transition-opacity duration-300 ease-in-out dark:text-gray-100 dark:border-gray-700 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>

        {/* Backdrop (Fondo oscuro) */}
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute inset-0 bg-white/60 backdrop-blur-sm dark:bg-gray-900/60"
          aria-hidden="true"
        />

        {/* Content (El menú lateral) */}
        <div className={`absolute top-0 right-0 h-full max-sm:w-full w-sm p-6 bg-background border-l shadow-xl transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>

          <div className="flex justify-end mb-8">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Cerrar menú"
              className="p-2 rounded-md cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Lista de Navegación Móvil */}
          <nav className="flex h-full flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 text-md font-semibold transition-colors hover:text-primary ${pathname === item.href ? 'text-primary' : 'text-foreground/90'}`}
              >
                {item.name}
              </Link>
            ))}

            <div className="mt-auto mb-20">
              {status === 'loading' && (
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              )}
              {status === 'unauthenticated' && (
                <div className="flex flex-col gap-4">
                  <Link href="/auth/signin">
                    <Button variant='outline' className="w-full">Login</Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="w-full text-white">Registrarse</Button>
                  </Link>
                </div>
              )}
              {status === 'authenticated' && user && (
                <div className="flex flex-col gap-4">
                  <span className="text-center font-semibold text-foreground/90">{`Hola, ${user.name}`}</span>
                  <Link href="/dashboard">
                    <Button className="w-full text-white">Dashboard</Button>
                  </Link>
                  <Button variant='outline' className="w-full" onClick={handleLogout}>Cerrar sesión</Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}