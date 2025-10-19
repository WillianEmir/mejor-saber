import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog";
import { TestimonioType, UserForSelect } from "../lib/testimonio.schema";
import TestimonioForm from "./TestimonioForm";


interface TestimonioModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonio: TestimonioType | null; 
  users: UserForSelect[];
}

export default function TestimonioModal({ isOpen, onClose, testimonio, users }: TestimonioModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{testimonio ? "Editar Testimonio" : "Crear Nuevo Testimonio"}</DialogTitle>
          <DialogDescription>
            {testimonio ? "Modifique los detalles del testimonio a continuación." : "Complete los detalles para crear un nuevo testimonio."}
          </DialogDescription>
        </DialogHeader>
        <TestimonioForm testimonio={testimonio} users={users} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}