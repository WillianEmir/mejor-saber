import AdminSchools from '@/src/components/dashboard/admin-schools/AdminSchools';
import { getSchools } from '@/src/lib/data/school.data';
import React from 'react';

export default async function page() {
  const schools = await getSchools();

  return (
    <>
      <AdminSchools schools={schools || []} />
    </>
  );
}