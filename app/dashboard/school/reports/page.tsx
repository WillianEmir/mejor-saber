import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { ReportsDashboard } from "@/src/components/dashboard/school/reports/reports-dashboard";
import { getSimulacroResults, getStudentProgress } from "@/src/lib/actions/reports.actions";
import { getServerSession } from "next-auth";

const SchoolReportsPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.schoolId) {
    return <div>No estás autorizado para ver esta página.</div>;
  }

  const schoolId = session.user.schoolId;
  const simulacroResults = await getSimulacroResults(schoolId);
  const studentProgress = await getStudentProgress(schoolId);

  return (
    <ReportsDashboard
      simulacroResults={simulacroResults}
      studentProgress={studentProgress}
    />
  );
};

export default SchoolReportsPage;