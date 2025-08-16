import { PricingCard } from "./PricingCard";

// Centralizamos los datos para que sean fáciles de modificar.
const tiers = [
  {
    name: 'Gratis',
    id: 'tier-gratis',
    href: '#',
    priceMonthly: '$0',
    description: "El plan perfecto si recién estás comenzando con nuestro producto.",
    features: [
      'Hasta 25 productos',
      'Límite de 10,000 subscriptores',
      'Analíticas avanzadas',
      'Soporte en 24 horas',
    ],
    featured: false,
  },
  {
    name: 'Premium',
    id: 'tier-premium',
    href: '#',
    priceMonthly: '$74.500',
    description: 'La versión completa, con todas las funcionalidades y simulacros ilimitados.',
    features: [
      'Productos ilimitados',
      'Subscriptores ilimitados',
      'Analíticas avanzadas',
      'Representante de soporte dedicado',
      'Automatizaciones de marketing',
      'Integraciones personalizadas',
    ],
    featured: true,
  },
];


export default function PricingPage() {
  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      {/* Elemento decorativo de fondo. No se toca, ya que es puramente estético. */}
      <div
        className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"
        aria-hidden="true"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
        />
      </div>

      {/* --- Encabezado de la Sección --- */}
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold leading-7 text-indigo-600">Planes y Precios</h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Planes que se ajustan a tus necesidades
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-600">
        Elige el plan perfecto para impulsar tu proyecto. Ofrecemos la mejor relación calidad-precio del mercado.
      </p>

      {/* --- Contenedor de las Tarjetas de Precios --- */}
      {/* La lógica de la grilla se mantiene, pero el contenido de cada celda ahora es un componente. */}
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <PricingCard key={tier.id} {...tier} isFirst={tierIdx === 0} />
        ))}
      </div>
    </div>
  );
}