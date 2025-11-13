import { getTestimonios, getTestimoniosCount, getUsersForSelect } from "./_lib/testimonio.data";

import TestimoniosList from "./_components/TestimoniosList";

const ITEMS_PER_PAGE = 10;

interface PageProps {
  searchParams: Promise<{ 
    q?: string;
    page?: string; 
  }>
}

export default async function TestimoniosPage({ searchParams }: PageProps) {
  
  const params = await searchParams;
  const query = params?.q;
  const currentPage = Number(params?.page) || 1;

  const [testimonios, totalTestimonios, users] = await Promise.all([
    getTestimonios(query, currentPage),
    getTestimoniosCount(query),
    getUsersForSelect(),
  ]);

  const totalPages = Math.ceil(totalTestimonios / ITEMS_PER_PAGE);

  return (
    <TestimoniosList
      testimonios={testimonios}
      users={users}
      totalPages={totalPages}
      currentPage={currentPage}
    />
  );
}
