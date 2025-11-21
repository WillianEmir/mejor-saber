'use client'
 
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Github, Youtube, Twitter, Instagram } from 'lucide-react';
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Precios', href: '/precios' },
  { name: 'Preguntas Frecuentes', href: '/faq' },
  { name: 'Contacto', href: '/contacto' },
  { name: 'Términos y Condiciones', href: '/terminos-condiciones' },
]

const socialLinks = [
  { name: 'Facebook', href: '#', icon: <Facebook className="h-6 w-6" /> },
  { name: 'Instagram', href: '#', icon: <Instagram className="h-6 w-6" /> },
  { name: 'Twitter', href: '#', icon: <Twitter className="h-6 w-6" /> },
  { name: 'Github', href: '#', icon: <Github className="h-6 w-6" /> },
  { name: 'YouTube', href: '#', icon: <Youtube className="h-6 w-6" /> },
];

export default function Footer() {

  const pathname = usePathname()

  return (
    <footer className="bg-neutral-light dark:bg-neutral-dark dark:text-gray-100" aria-labelledby="footer-heading">

      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16">
        <div className="md:grid md:grid-cols-2 md:gap-8">
          <div className="space-y-8">
            <Link href="/" className="-m-1.5 p-1.5 flex items-center">
              <Image
                src="/logo.png"
                alt="Saber Ya Logo"
                width={120}
                height={120}
                className="h-auto w-auto"
                priority
              />
            </Link>
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
              Prepárate para el examen Saber 11 con nuestra plataforma de estudio interactiva.
            </p>
          </div>
          <div className="mt-16 ">
            <h3 className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">Conócenos</h3>
            <ul role="list" className="mt-6 space-y-4">
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
        </div>

        <div className="mt-16 border-t dark:border-t-neutral-light border-gray-900/10 pt-8 sm:mt-20 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs leading-5 text-neutral-dark dark:text-neutral-light mb-4 sm:mb-0">
            &copy; {new Date().getFullYear()} Mejor, Inc. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6">
            {socialLinks.map((item) => (
              <Link key={item.name} href={item.href} className="text-neutral-dark hover:text-neutral-dark/50 dark:text-neutral-light dark:hover:text-neutral-light/50 transition-colors duration-200">
                <span className="sr-only">{item.name}</span>
                {item.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}