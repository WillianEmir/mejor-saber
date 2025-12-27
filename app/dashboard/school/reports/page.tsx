import { auth } from "@/auth"; // Updated import
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import ReportsGraph from "./_components/ReportsGraph";
import ReportListArea from "./_components/ReportListArea";
import { getSchoolSedes, getSchoolProgressChartsData } from "../_lib/school.data";
 
export default async function SchoolReportsPage() {
  const session = await auth(); // Updated call

  if (!session || !session.user || !session.user.schoolId) {
    return <div>No estás autorizado para ver esta página.</div>; 
  }

  const schoolId = session.user.schoolId;  

  const sedes = await getSchoolSedes(schoolId);
  const initialProgressData = await getSchoolProgressChartsData(schoolId);

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
              initialProgressData={initialProgressData}
            />
          </div>
        </TabsContent>
        <TabsContent value="listado-usuarios">
          <ReportListArea sedes={sedes} schoolId={schoolId} initialStudentReports={initialProgressData.studentExportData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};