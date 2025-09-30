import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { SchoolDashboard } from "@/src/components/dashboard/school/school-dashboard";
import { getServerSession } from "next-auth";

const SchoolPage = async () => {
  const session = await getServerSession(authOptions);

  if(!session || !session.user || !session.user.schoolId) {
    return <div>No estás autorizado para ver esta página.</div>;
  }
  
  return (
    <div>
      <SchoolDashboard session={session} />
    </div>
  );
};

export default SchoolPage;