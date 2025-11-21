import { notFound } from 'next/navigation';

import { getSchools } from '@/app/dashboard/admin/schools/_lib/school.data';
import { getUsers } from '@/app/dashboard/admin/users/_lib/user.data';

import UsersList from '@/app/dashboard/admin/users/_components/UsersList';

export default async function AdminUsersPage() {
  
  const users = await getUsers();
  const schools = await getSchools();
  
  if(!users) notFound()
  
  return <UsersList users={users} schools={schools} />;
}
 