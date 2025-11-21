import { Users, FileText, Target, BookUser } from 'lucide-react'; 

import { getSchoolStats } from '../_lib/school.data';

import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card';

export default async function SchoolStatsCards() {  
  const stats = await getSchoolStats();

  if (!stats) {
    return <div>No se pudieron cargar las estadísticas.</div>;
  }

  const { studentCount, teacherCount, completedSimulations, averageScore } = stats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Estudiantes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{studentCount}</div>
          <p className="text-xs text-muted-foreground">Total de estudiantes</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Docentes</CardTitle>
          <BookUser className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{teacherCount}</div>
          <p className="text-xs text-muted-foreground">Total de docentes</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Simulacros Completados</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedSimulations}</div>
          <p className="text-xs text-muted-foreground">Realizados por los estudiantes</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Puntaje Promedio</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageScore.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Promedio en todos los simulacros</p>
        </CardContent>
      </Card>
    </div>
  );
}
