'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/ui/dialog";
import AddTestimonialForm from "./AddTestimonialForm";

interface AddTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddTestimonialModal({ isOpen, onClose }: AddTestimonialModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Agregar tu Testimonio</DialogTitle>
          <DialogDescription>
            Nos encantaría saber tu opinión sobre tu experiencia.
          </DialogDescription>
        </DialogHeader>
        <AddTestimonialForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
