import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import AdminschoolUsers from '@/src/components/dashboard/adminschool-users/AdminschoolUsers'
// import { getUserBySchoolId } from '@/src/lib/data/user.data';
import { getServerSession } from 'next-auth';
import React from 'react'

export default async function page() {

  const session = await getServerSession(authOptions);

  const schoolId = session?.user?.schoolId;  

  if (!schoolId) {
    return <div>No se pudo obtener el ID de la escuela.</div>;
  }

  // const users = await getUserBySchoolId(schoolId);

  return (
    <>
      <AdminschoolUsers
        users={users}
      />
    </>
  )
}
