"use client"; 

import { useState, useTransition } from "react";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { deleteTestimonio } from "../_lib/testimonio.actions";
import { TestimonioType, UserForSelect } from "../_lib/testimonio.schema";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/Button";
import { Badge } from "@/src/components/ui/badge";

import { ConfirmationDialog } from "@/src/components/ui/ConfirmationDialog";
import TestimonioModal from "./TestimonioModal";
import TestimoniosFilters from "./TestimoniosFilters";
import Pagination from "./TestimoniosPagination";

interface TestimoniosProps {
  testimonios: TestimonioType[];
  users: UserForSelect[];
  totalPages: number;
  currentPage: number;
}

export default function TestimoniosList({ testimonios, users, totalPages, currentPage }: TestimoniosProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTestimonio, setCurrentTestimonio] = useState<TestimonioType | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeletePending, startDeleteTransition] = useTransition();

  const handleEdit = (testimonio: TestimonioType) => {
    setCurrentTestimonio(testimonio);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentTestimonio(null);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setDeleteAlertOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    startDeleteTransition(async () => {
      const result = await deleteTestimonio(deleteId);
      if (result?.message) {
        toast.success(result.message);
      } else {
        toast.error("Ocurrió un error al eliminar el testimonio.");
      }
      setDeleteAlertOpen(false);
      setDeleteId(null);
    });
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentTestimonio(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Administración de Testimonios</CardTitle>
          <Button onClick={handleAddNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Testimonio
          </Button>
        </CardHeader>

        <CardContent>
          <TestimoniosFilters />
          {testimonios.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Testimonio</TableHead>
                      <TableHead className="hidden md:table-cell">Publicado</TableHead>
                      <TableHead>
                        <span className="sr-only">Acciones</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  
                  <TableBody>
                    {testimonios.map((testimonio) => (
                      <TableRow key={testimonio.id}>
                        <TableCell>
                          <div className="font-medium">{`${testimonio.user.name} ${testimonio.user.lastName}`}</div>
                          <div className="text-sm text-muted-foreground">{testimonio.user.email}</div>
                        </TableCell>
                        <TableCell className="truncate max-w-[200px] md:max-w-[400px]">{testimonio.comentario}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant={testimonio.publicado ? "default" : "outline"}>
                            {testimonio.publicado ? "Sí" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEdit(testimonio)}>Editar</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDelete(testimonio.id!)} className="text-red-600">
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination totalPages={totalPages} currentPage={currentPage} />
            </>
          ) : (
            <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
              <h3 className="text-lg font-medium">No hay Testimonios</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No se encontraron testimonios con los filtros aplicados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <TestimonioModal
        isOpen={modalOpen}
        onClose={closeModal}
        testimonio={currentTestimonio}
        users={users}
      />

      <ConfirmationDialog
        isOpen={deleteAlertOpen}
        onClose={() => setDeleteAlertOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        description="¿Estás seguro de que deseas eliminar este testimonio? Esta acción no se puede deshacer."
        isPending={isDeletePending}
      />
    </div>
  );
}