import { useActionState, useEffect, useTransition } from "react";
import { TestimonioType, TestimonioFormType, TestimonioSchema, UserForSelect } from "../lib/testimonio.schema";
import { FormField, FormItem, FormLabel, FormControl, Form } from "@/src/components/ui/form";
import { toast } from "sonner";
import { createOrUpdateTestimonio } from "../lib/testimonio.actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import { Button } from "@/src/components/ui/Button";
import { useForm } from "react-hook-form";

interface TestimonioFormProps {
  testimonio: TestimonioType | null;
  users: UserForSelect[];
  onSuccess: () => void;
}

export default function TestimonioForm({ testimonio, users, onSuccess }: TestimonioFormProps) {

  const [state, formAction] = useActionState(createOrUpdateTestimonio, { message: "" });
  const [isPending, startTransition] = useTransition();

  const form = useForm<TestimonioFormType>({
    defaultValues: {
      id: testimonio?.id || "",
      rating: testimonio?.rating || 5,
      comentario: testimonio?.comentario || "",
      publicado: testimonio?.publicado || false,
      userId: testimonio?.userId || "",
    }
  });

  useEffect(() => {
    if (state.message || state.errors) {
      if (state.errors) {
        toast.error(state.message);
      }
      else {
        toast.success(state.message);
        onSuccess();
      }
    }
    state.message = "";
  }, [state, onSuccess]);

  const onSubmit = (data: TestimonioFormType) => {

    const parsedData = TestimonioSchema.safeParse(data);

    if (!parsedData.success) {
      parsedData.error.issues.forEach(issue => {
        toast.error(issue.message);
      });
      return;
    }

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'id' && !value) return
      if (value !== null && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!testimonio}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un usuario" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {`${user.firstName} ${user.lastName || ''}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calificación (1-5)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comentario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentario</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publicado"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-md border border-neutral-light p-3 shadow-sm ransition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1">
              <div className="space-y-0.5">
                <FormLabel>Publicado</FormLabel>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" variant='default' className="w-full" disabled={form.formState.isSubmitting || isPending}>
          {(form.formState.isSubmitting || isPending) ? "Guardando..." : (testimonio ? "Actualizar" : "Crear")}
        </Button>
      </form>
    </Form>
  );
}