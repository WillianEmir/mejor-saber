"use client";

import { useForm } from "react-hook-form";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/Button";
import { Textarea } from "@/src/components/ui/textarea";

import { BadgeFormValues, badgeSchema } from "../_lib/Badge.schema";
import { createBadge, updateBadge } from "../_lib/Badge.actions";

interface BadgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: BadgeFormValues | null;
}

export const BadgeModal = ({ isOpen, onClose, initialData }: BadgeModalProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<BadgeFormValues>({
    defaultValues: initialData || {
      name: "",
      description: "",
      iconUrl: "",
      criteria: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        name: "",
        description: "",
        iconUrl: "",
        criteria: "",
      });
    }
  }, [initialData, form]);

  const onSubmit = (values: BadgeFormValues) => {

    const parsedData = badgeSchema.safeParse(values)

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message)
      })
      return
    }

    startTransition(async () => {
      if (initialData?.id) {
        const result = await updateBadge(initialData.id, values);
        if (result.success) {
          toast.success(result.success);
          onClose();
        } else {
          toast.error(result.error);
        }
      } else {
        const result = await createBadge(values);
        if (result.success) {
          toast.success(result.success);
          onClose();
        } else {
          toast.error(result.error);
        }
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Insignia" : "Crear Insignia"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isPending} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="iconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Icono</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="criteria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Criterio</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isPending} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {initialData ? "Guardar cambios" : "Crear Insignia"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
