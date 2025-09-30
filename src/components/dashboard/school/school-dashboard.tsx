import { CreditCard, DollarSign, Users } from "lucide-react";
import { SummaryCard } from "./summary-card";
import { getSchoolDashboardStats } from "@/src/lib/actions/school.actions";
import { Session } from "next-auth";

interface SchoolDashboardProps {
  session: Session | null;
}

export const SchoolDashboard = async ({ session }: SchoolDashboardProps) => {
  if (!session || !session.user || !session.user.schoolId) {
    return <div>No estás autorizado para ver esta página.</div>;
  }

  const stats = await getSchoolDashboardStats(session.user.schoolId);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Total de Estudiantes" 
          value={stats.studentCount.toString()} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
        />
        <SummaryCard 
          title="Promedio General" 
          value={stats.averageScore.toString()} 
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} 
        />
        <SummaryCard 
          title="Simulacros Completados" 
          value={stats.completedSimulacros.toString()} 
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} 
        />
        <SummaryCard 
          title="Nuevos Usuarios" 
          value={`+${stats.newUsersCount.toString()}`} 
          icon={<Users className="h-4 w-4 text-muted-foreground" />} 
        />
      </div>
      <div>
        {/* Aquí se puede agregar un componente para mostrar la actividad reciente */}
      </div>
    </div>
  );
};