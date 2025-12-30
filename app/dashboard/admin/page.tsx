import { getAdminDashboardStats, getQuestionCountHierarchy, getContenidoCurricularStats, getTestimoniosStats, getScoreDistributionByArea } from "@/app/dashboard/admin/_lib/admin.data";

import { Users, HelpCircle, Book, School } from 'lucide-react'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"; 
import { ContenidoCurricularStats } from "./_components/ContenidoCurricularStats";
import { TestimoniosStats } from "./_components/TestimoniosStats";
import { ScoreDistribution } from "./_components/ScoreDistribution";
import { StatCard } from "./_components/StatCard";
import { QuestionHierarchy } from "./_components/QuestionHierarchy";
import { QuickActions } from "./_components/QuickActions";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();
  const hierarchy = await getQuestionCountHierarchy();
  const contenidos = await getContenidoCurricularStats();
  const testimonios = await getTestimoniosStats();
  const scoreDistribution = await getScoreDistributionByArea(); 

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <h2 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
        Dashboard de Administración
      </h2>
      <p className="text-gray-600 dark:text-gray-400">Vista general del estado de la aplicación.</p>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contenido">Contenido y Desempeño</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          {/* Stat Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-4">
            <StatCard icon={Users} title="Usuarios Totales" value={stats.userCount.toString()} subtext="Usuarios registrados en el sistema" />
            <StatCard icon={HelpCircle} title="Preguntas Totales" value={stats.questionCount.toString()} subtext="Preguntas en la base de datos" />
            <StatCard icon={Book} title="Simulacros Realizados" value={stats.simulacroCount.toString()} subtext="Sesiones completadas por usuarios" />
            <StatCard icon={School} title="Colegios Registrados" value={stats.schoolCount.toString()} subtext="Instituciones afiliadas" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Question Hierarchy */}
            <div className="lg:col-span-2">
              <QuestionHierarchy hierarchy={hierarchy} />
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <QuickActions />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="contenido">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3">
                    <ContenidoCurricularStats areas={contenidos} />
                </div>
                <div className="lg:col-span-1">
                    <TestimoniosStats testimonios={testimonios} />
                </div>
                <div className="lg:col-span-2">
                    <ScoreDistribution scoreDistribution={scoreDistribution} />
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}