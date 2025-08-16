import { CheckIcon } from '@heroicons/react/20/solid';

// Helper para unir clases de CSS condicionalmente
function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

// Definimos la "forma" de los datos de un plan para mayor seguridad con TypeScript
type Tier = {
  name: string;
  id: string;
  href: string;
  priceMonthly: string;
  description: string;
  features: string[];
  featured: boolean;
};

// Props que nuestro componente de tarjeta recibirá
type PricingCardProps = Tier & {
  isFirst: boolean; // Para manejar los bordes redondeados
};

// --- COMPONENTE REUTILIZABLE PARA LA TARJETA DE PRECIO ---
export function PricingCard({ name, id, href, priceMonthly, description, features, featured, isFirst }: PricingCardProps) {
  return (
    <div
      key={id}
      className={classNames(
        // Estilo base para todas las tarjetas
        'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10',
        // Estilos condicionales para la tarjeta destacada vs. la normal
        featured 
          ? 'relative bg-slate-900 shadow-2xl' 
          : 'bg-white/60 sm:mx-8 lg:mx-0',
        // Lógica compleja para los bordes redondeados en pantallas grandes
        featured
          ? ''
          : isFirst
          ? 'lg:rounded-r-none'
          : 'lg:rounded-l-none'
      )}
    >
      <h3 id={id} className={classNames('text-lg font-semibold leading-8', featured ? 'text-indigo-400' : 'text-indigo-600')}>
        {name}
      </h3>
      <p className="mt-4 flex items-baseline gap-x-2">
        <span className={classNames('text-5xl font-bold tracking-tight', featured ? 'text-white' : 'text-slate-900')}>
          {priceMonthly}
        </span>
        <span className={classNames('text-base font-semibold leading-7', featured ? 'text-gray-400' : 'text-gray-500')}>
          /mes
        </span>
      </p>
      <p className={classNames('mt-6 text-base leading-7', featured ? 'text-gray-300' : 'text-slate-600')}>
        {description}
      </p>
      <ul role="list" className={classNames('mt-8 space-y-3 text-sm leading-6', featured ? 'text-gray-300' : 'text-slate-600')}>
        {features.map((feature) => (
          <li key={feature} className="flex gap-x-3">
            <CheckIcon
              className={classNames('h-6 w-5 flex-none', featured ? 'text-indigo-400' : 'text-indigo-600')}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>
      <a
        href={href}
        aria-describedby={id}
        className={classNames(
          'mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          featured
            ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
            : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600'
        )}
      >
        Empieza Hoy
      </a>
    </div>
  );
}