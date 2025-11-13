import { getSchoolSedes } from './_lib/data';
import { getUsersBySchoolId } from './_lib/actions';

import UserManagement from './_components/UserManagement';

export default async function SchoolUsersPage() {

  const [users, sedes] = await Promise.all([ getUsersBySchoolId(), getSchoolSedes() ]);

  return (
    <div className="p-4 md:p-8">
      <UserManagement initialUsers={users} sedes={sedes} />
    </div>
  );
}