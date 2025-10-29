import { CheckIcon } from '@heroicons/react/20/solid';
import { cn } from '@/src/lib/utils.client';

interface Tier {
  name: string;
  id: string;
  href: string;
  priceMonthly: string;
  description: string;
  features: string[];
  featured: boolean;
}

export function PricingCard({ name, id, href, priceMonthly, description, features, featured }: Tier) {
  return (
    <div
      key={id}
      className={cn(
        featured ? 'z-10 bg-white shadow-xl dark:bg-neutral-dark/80' : 'bg-white dark:bg-neutral-dark/80',
        featured ? 'ring-1 ring-slate-900/10 dark:bg-neutral-dark/80' : 'ring-1 ring-slate-200 dark:bg-neutral-dark/80',
        'rounded-3xl p-8'
      )}
    >
      <h3 className="text-lg font-semibold leading-8 text-neutral-dark dark:text-neutral-light">{name}</h3>
      <p className="mt-4 text-sm leading-6 text-neutral-dark/90 dark:text-neutral-light">{description}</p>
      <p className="mt-6 flex items-baseline gap-x-1">
        <span className="text-4xl font-bold tracking-tight text-neutral-dark dark:text-neutral-light">{priceMonthly}</span>
        {typeof priceMonthly === 'string' && priceMonthly.startsWith('$') && (
          <span className="text-sm font-semibold leading-6 text-neutral-dark/90 dark:text-neutral-light">/mes</span>
        )}
      </p>
      <a
        href={href}
        aria-describedby={id}
        className={cn(
          featured
            ? 'bg-primary text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-primary'
            : 'text-primary ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-primary',
          'mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-offset-2'
        )}
      >
        Comprar plan
      </a>
      <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-slate-600">
        {features.map((feature) => (
          <li key={feature} className="flex gap-x-3">
            <CheckIcon className="h-6 w-5 flex-none text-primary" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
