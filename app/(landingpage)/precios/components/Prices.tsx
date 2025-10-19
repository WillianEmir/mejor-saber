import { PricingCard } from "./PricingCard";
import { GridPattern } from "./GridPattern";

// Centralizamos los datos para que sean fáciles de modificar.
const tiers = [
  {
    name: 'Gratis',
    id: 'tier-gratis',
    href: '/dashboard',
    priceMonthly: '$0',
    description: "Ideal para empezar, con acceso limitado a las funciones.",
    features: [
      'Acceso a una parte del material de estudio',
      'Simulacros de prueba con límite de preguntas',
      'Soporte básico por correo electrónico',
    ],
    featured: false,
  },
  {
    name: 'Premium',
    id: 'tier-premium',
    href: '/dashboard',
    priceMonthly: '$74.500',
    description: 'Acceso completo para una preparación individual sin límites.',
    features: [
      'Acceso a todo el material de estudio',
      'Simulacros de prueba ilimitados',
      'Análisis de progreso personalizado',
      'Ranking y comparación con otros usuarios',
      'Soporte prioritario',
    ],
    featured: true,
  },
  {
    name: 'Instituciones',
    id: 'tier-instituciones',
    href: '/dashboard',
    priceMonthly: 'Personalizado',
    description: 'Solución para colegios con seguimiento detallado y descuentos.',
    features: [
      'Cuentas para un número determinado de estudiantes',
      'Descuento especial por volumen',
      'Panel de seguimiento del progreso de los estudiantes',
      'Reportes detallados por estudiante y grupo',
      'Soporte y capacitación para docentes',
    ],
    featured: false,
  },
];


export default function PricingPage() {
  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-neutral-dark">
      {/* Elemento decorativo de fondo con patrón SVG. */}
      <GridPattern
        width={60}
        height={60}
        x={-1}
        y={-1}
      />

      {/* --- Encabezado de la Sección --- */}
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold leading-7 text-primary sm:text-lg">Planes y Precios</h2>
        <p className="mt-2 text-4xl font-bold tracking-tight text-neutral-dark sm:text-5xl dark:text-neutral-light">
          Planes que se ajustan a tus necesidades
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-neutral-dark/90 dark:text-neutral-light">
        Elige el plan perfecto para impulsar tu proyecto. Ofrecemos la mejor relación calidad-precio del mercado.
      </p>

      {/* --- Contenedor de las Tarjetas de Precios --- */}
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-7xl lg:grid-cols-3">
        {tiers.map((tier) => (
          <PricingCard key={tier.id} {...tier} />
        ))}
      </div>
    </div>
  );
}