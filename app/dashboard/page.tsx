import { redirect } from 'next/navigation'; 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/options'; 

export default async function DashboardPage() {
  
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect('/auth/signin');
  }

  // const { role } = session.user;

  // switch (role) {
  //   case 'ADMIN':
  //     redirect('/dashboard/admin');
  //     break;
  //   case 'ADMINSCHOOL':
  //     redirect('/dashboard/school');
  //     break;
  //   case 'USER':
  //     redirect('/dashboard/user');
  //     break;
  //   default:
  //     // Por seguridad, redirige a la página de login si el rol no es reconocido
  //     redirect('/auth/signin');
  // }

  // Este componente nunca renderiza UI, solo redirige.
  return null;
}
