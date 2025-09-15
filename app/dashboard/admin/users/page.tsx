import AdminUsers from '@/src/components/dashboard/admin-users/AdminUsers';
import { getUsers } from '@/src/lib/data/user.data';
import { notFound } from 'next/navigation';

export default async function AdminUsersPage() {
  
  const users = await getUsers();
  
  if(!users) notFound()
  
  return <AdminUsers users={users} />;
}
