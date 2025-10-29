'use client'

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { createTestimonial } from '@/app/dashboard/admin/testimonios/lib/testimonio.actions';

import { Button } from '@/src/components/ui/Button';
import { Textarea } from '@/src/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/src/components/ui/form';
import { Star } from 'lucide-react';

import { TestimonialFormType, TestimonialSchema } from '@/app/dashboard/admin/testimonios/lib/testimonio.schema';

interface AddTestimonialFormProps {
  onSuccess: () => void;
}

export default function AddTestimonialForm({ onSuccess }: AddTestimonialFormProps) {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(5);

  const form = useForm<TestimonialFormType>({
    defaultValues: {
      rating: 5,
      comentario: '',
    },
  });

  const onSubmit = (data: TestimonialFormType) => {

    const parsedData = TestimonialSchema.safeParse(data);

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message);
      });
      return;
    }

    const formData = new FormData();
    formData.append('rating', String(rating));
    formData.append('comentario', data.comentario);

    startTransition(async () => {
      const result = await createTestimonial(formData);
      if (result.success) {
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <FormLabel>Calificación</FormLabel>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`cursor-pointer ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="comentario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentario</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Cuéntanos tu experiencia..."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Enviando...' : 'Enviar Testimonio'}
        </Button>
      </form>
    </Form>
  );
}
