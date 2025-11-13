import { getSchools } from '@/app/dashboard/admin/schools/_lib/school.data';

import SchoolList from '@/app/dashboard/admin/schools/_components/school/SchoolList';
import { notFound } from 'next/navigation';

export default async function page() {

  const schools = await getSchools();

  if(!schools) notFound()

  return (
    <>
      <SchoolList schools={schools} />
    </>
  );
}