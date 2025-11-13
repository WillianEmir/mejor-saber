
'use client';

import { getTestimoniosStats } from "@/app/dashboard/admin/_lib/admin.data";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

interface TestimoniosStatsProps {
  testimonios: Awaited<ReturnType<typeof getTestimoniosStats>>;
}

export const TestimoniosStats = ({ testimonios }: TestimoniosStatsProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Testimonios</CardTitle>
    </CardHeader>
    <CardContent>
      <ul>
        {testimonios.map((testimonio) => (
          <li key={testimonio.rating} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <span>Calificación: {testimonio.rating} estrellas</span>
            <span className="font-semibold">{testimonio._count.rating} usuarios</span>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);
