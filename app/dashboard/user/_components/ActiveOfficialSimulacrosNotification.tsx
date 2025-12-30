import Link from 'next/link';

interface ActiveOfficialSimulacrosNotificationProps {
  officialSimulacros: {
    id: string;
    nombre: string;
    area: {
      id: string;
      nombre: string;
    };
  }[];
}

export function ActiveOfficialSimulacrosNotification({ officialSimulacros }: ActiveOfficialSimulacrosNotificationProps) {
  if (officialSimulacros.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
      <h3 className="font-bold text-lg mb-2">¡Atención! Simulacros Oficiales Activos</h3>
      <ul className="list-disc pl-5">
        {officialSimulacros.map((simulacro) => (
          <li key={simulacro.id} className="mb-1">
            <Link
              href={`/dashboard/user/simulacros/${simulacro.area.id}/all?officialSimulacroId=${simulacro.id}`}
              className="text-blue-700 hover:underline font-semibold"
            >
              {simulacro.nombre} ({simulacro.area.nombre})
            </Link>
            <span className="ml-2 text-sm">
              - Disponible
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm">
        Haz clic en el simulacro para iniciar la práctica.
      </p>
    </div>
  );
}
