"use client"; 

import * as React from "react";

import { TestimonioType, UserForSelect } from "../lib/testimonio.schema";
import { deleteTestimonio } from "../lib/testimonio.actions";
import { DataTable } from "@/src/components/ui/data-table";

import { Button } from "@/src/components/ui/Button";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";
import DeleteConfirmationDialog from "./TestimonioDeleteConfirmation";
import TestimonioModal from "./TestimonioModal";
import { TestimonioColumns } from "./TestimonioColumns";

interface TestimoniosProps {
  initialTestimonios: TestimonioType[];
  users: UserForSelect[];
}

export default function Testimonios({ initialTestimonios, users }: TestimoniosProps) {

  const [testimonios, setTestimonios] = useState(initialTestimonios);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTestimonio, setCurrentTestimonio] = useState<TestimonioType | null>(null);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeletePending, startDeleteTransition] = useTransition();

  useEffect(() => {
    setTestimonios(initialTestimonios); 
  }, [initialTestimonios]);

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
        setTestimonios((prev) => prev.filter((t) => t.id !== deleteId));
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
    <div className="p-4 md:p-6 bg-white dark:bg-neutral-dark min-h-screen">
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Gestión de Testimonios</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2 cursor-pointer">
          <PlusCircle className="h-4 w-4" />
          <span>Añadir Testimonio</span>
        </Button>
      </div>

      <div className="bg-white dark:bg-neutral-light/10 p-3 rounded-md shadow-md shadow-black/30 overflow-hidden">

        <DataTable
          columns={TestimonioColumns}
          data={testimonios}
          filterColumn="user"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <TestimonioModal
        isOpen={modalOpen}
        onClose={closeModal}
        testimonio={currentTestimonio}
        users={users}
      />

      <DeleteConfirmationDialog
        isOpen={deleteAlertOpen}
        onClose={() => setDeleteAlertOpen(false)}
        onConfirm={confirmDelete}
        isPending={isDeletePending}
      />
    </div>
  );
}