import { getSchools } from '@/app/dashboard/admin/schools/_lib/school.data';

import SchoolList from '@/app/dashboard/admin/schools/_components/school/SchoolList';

export default async function page() {

  const schools = await getSchools();

  return (
    <>
      <SchoolList schools={schools} /> 
    </> 
  );
}