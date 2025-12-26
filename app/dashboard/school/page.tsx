import { auth } from "@/auth";

import { getSchoolProgressChartsData } from "./_lib/school.data";

import SchoolProgress from "./_components/SchoolProgress";

export default async function SchoolDashboardPage() {
  
  const session = await auth();

  if (session?.user?.role !== 'ADMIN' && session?.user?.role !== 'ADMINSCHOOL') {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold">No autorizado</h1>
        <p>
          No tienes permisos para ver esta página.
        </p>
      </div>
    );
  }

  if (!session?.user?.schoolId) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold">Escuela no encontrada</h1>
        <p>
          No estás asociado a ninguna escuela.
        </p>
      </div>
    );
  }

  const schoolData = await getSchoolProgressChartsData(session.user.schoolId);

  return <SchoolProgress data={schoolData} />;
}