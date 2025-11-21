import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { getServerSession } from "next-auth";
import ReportsGraph from "./_components/ReportsGraph";
import ReportListArea from "./_components/ReportListArea";
import { getSchoolSedes } from "./_lib/reports.data";

export default async function SchoolReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.schoolId) {
    return <div>No estás autorizado para ver esta página.</div>; 
  }

  const schoolId = session.user.schoolId;

  const sedes = await getSchoolSedes(schoolId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reportes de Rendimiento Estudiantil</h1>

      <Tabs defaultValue="reporte-grafico">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="reporte-grafico">Progreso de Estudiantes</TabsTrigger>
          <TabsTrigger value="listado-usuarios">Listado Usuarios</TabsTrigger>
        </TabsList>
        <TabsContent value="reporte-grafico">
          <div className="space-y-4">
            <ReportsGraph
              sedes={sedes}
              schoolId={schoolId}
            />
          </div>
        </TabsContent>
        <TabsContent value="listado-usuarios">
          <ReportListArea sedes={sedes} schoolId={schoolId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
