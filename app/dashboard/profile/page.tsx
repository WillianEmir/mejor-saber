import { getServerSession } from 'next-auth/next';
import { ProfileForm } from '@/app/dashboard/profile/components/ProfileForm';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { getUserById } from './lib/profile.data';

export default async function ProfilePage() {

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect('/auth/signin');
  }

  const user = await getUserById(session.user.id);

  if (!user) {
    return redirect('/auth/signin'); 
  }

  return (
    <ProfileForm user={user} />
  );
}