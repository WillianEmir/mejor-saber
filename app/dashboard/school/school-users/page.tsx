import { getSchoolSedes } from './_lib/sede.data';
import { getSchoolDataForUserManagement } from './_lib/school.data';
import UserManagement from './_components/UserManagement';
import { getUsersBySchoolId } from './_lib/user.data';

export default async function SchoolUsersPage() {

  const [users, sedes, schoolData] = await Promise.all([ 
    getUsersBySchoolId(), 
    getSchoolSedes(),
    getSchoolDataForUserManagement()
  ]);

  if (!schoolData) {
    return (
      <div className="p-4 md:p-8 text-center">
        <p>No se pudieron cargar los datos del colegio.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <UserManagement 
        initialUsers={users} 
        sedes={sedes} 
        maxUsers={schoolData.maxUsers}
        userCount={schoolData._count.users}
      /> 
    </div>
  );
}  