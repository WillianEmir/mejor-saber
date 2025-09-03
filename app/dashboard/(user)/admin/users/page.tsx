import AdminUsers from '@/src/components/dashboard/admin-users/AdminUsers';
import { getUsers } from '@/src/lib/data/user.data';


export default async function AdminUsersPage() {
  const users = await getUsers();
  
  return <AdminUsers users={users} />;
}
