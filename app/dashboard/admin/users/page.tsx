import { notFound } from 'next/navigation';

import { getSchools } from '@/app/dashboard/admin/schools/_lib/school.data';
import { getDashboardAdminUsers } from '@/app/dashboard/admin/users/_lib/user.data';

import UsersList from '@/app/dashboard/admin/users/_components/UsersList';

export default async function AdminUsersPage() {

  const [users, schools] = await Promise.all([getDashboardAdminUsers(), getSchools()]);

  if (!users || users.length === 0) notFound()

  return <UsersList users={users} schools={schools} />;
}