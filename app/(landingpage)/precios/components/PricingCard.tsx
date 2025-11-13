import { CheckIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import Link from 'next/link';

interface PricingCardProps {
  plan: {
    name: string;
    price: string;
    description: string;
    features: string[];
    isFeatured: boolean;
    cta: string;
    href: string;
  };
}

export default function PricingCard({ plan }: PricingCardProps) {
  return (
    <div
      className={clsx(
        'relative flex flex-col rounded-3xl p-8',
        plan.isFeatured
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
      )}
    >
      {plan.isFeatured && (
        <div className="absolute top-0 right-8">
          <div className="inline-flex items-center justify-center px-4 py-1 text-xs font-semibold tracking-wide text-white uppercase bg-blue-600 rounded-b-lg">
            Popular
          </div>
        </div>
      )}
      <h3 className="text-2xl font-semibold leading-7">{plan.name}</h3>
      <p className="mt-4 flex items-baseline gap-x-2">
        <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
        <span className="text-base font-medium text-gray-500 dark:text-gray-400">/mes</span>
      </p>
      <p className="mt-6 text-base leading-7">{plan.description}</p>
      <ul
        role="list"
        className={clsx(
          'mt-8 space-y-4 text-sm leading-6',
          plan.isFeatured ? 'text-gray-300 dark:text-gray-600' : 'text-gray-600 dark:text-gray-300'
        )}
      >
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-x-3">
            <CheckIcon
              className={clsx(
                'h-6 w-5 flex-none',
                plan.isFeatured ? 'text-blue-400' : 'text-blue-600'
              )}
              aria-hidden="true"
            />
            {feature}
          </li>
        ))}
      </ul>
      <Link
        href={plan.href}
        aria-describedby={`plan-${plan.name}`}
        className={clsx(
          'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-offset-2',
          plan.isFeatured
            ? 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200 focus-visible:outline-blue-600'
        )}
      >
        {plan.cta}
      </Link>
    </div>
  );
}