"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/Button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/components/ui/alert-dialog"; 
import { BadgeFormValues } from "../_lib/Badge.schema";
import { BadgeModal } from "./BadgeModal";
import { deleteBadge } from "../_lib/Badge.actions";

interface BadgesProps {
  initialBadges: BadgeFormValues[];
}

export const Badges = ({ initialBadges }: BadgesProps) => {
  const [badges, setBadges] = useState<BadgeFormValues[]>(initialBadges);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBadge, setEditingBadge] = useState<BadgeFormValues | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [badgeToDelete, setBadgeToDelete] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const router = useRouter(); // Para refrescar si revalidatePath no es suficiente en este contexto

  const handleCreateNew = () => {
    setEditingBadge(null);
    setIsModalOpen(true);
  };

  const handleEdit = (badge: BadgeFormValues) => {
    setEditingBadge(badge);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = (id: string) => {
    setBadgeToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!badgeToDelete) return;

    startTransition(async () => {
      const result = await deleteBadge(badgeToDelete);
      if (result.success) {
        toast.success(result.success);
        setBadges((prev) => prev.filter((b) => b.id !== badgeToDelete)); // Optimistic UI update
        router.refresh(); // Asegura la revalidación
      } else {
        toast.error(result.error);
      }
      setIsDeleteDialogOpen(false);
      setBadgeToDelete(null);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreateNew}>Crear Nueva Insignia</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>URL del Icono</TableHead>
            <TableHead>Criterio</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {badges.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No hay insignias para mostrar.
              </TableCell>
            </TableRow>
          ) : (
            initialBadges.map((badge) => ( // Render initialBadges to avoid stale state from client-side setBadges
              <TableRow key={badge.id}>
                <TableCell className="font-medium">{badge.name}</TableCell>
                <TableCell>{badge.description}</TableCell>
                <TableCell>
                  <a href={badge.iconUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Ver Icono
                  </a>
                </TableCell>
                <TableCell>{badge.criteria}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(badge)}
                    className="mr-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => badge.id && handleDeleteConfirm(badge.id)}
                    disabled={isPending}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <BadgeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingBadge}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente
              la insignia y la removerá de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
