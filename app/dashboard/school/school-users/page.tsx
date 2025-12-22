import { getSchoolSedes } from './_lib/sede.data';

import UserManagement from './_components/UserManagement';
import { getUsersBySchoolId } from './_lib/user.data';

export default async function SchoolUsersPage() {

  const [users, sedes] = await Promise.all([ getUsersBySchoolId(), getSchoolSedes() ]);

  return (
    <div className="p-4 md:p-8">
      <UserManagement initialUsers={users} sedes={sedes} /> 
    </div>
  );
}  