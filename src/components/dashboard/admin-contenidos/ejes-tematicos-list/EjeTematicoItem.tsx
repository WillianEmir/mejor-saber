'use client'

import { EjeTematicoType } from "@/src/lib/schemas/ejeTematico.schema";
import ItemActionMenu from "../../admin-areas/area-view/ItemActionMenu";

interface EjeTematicoItemProps {
  eje: EjeTematicoType;
  onEdit: (eje: EjeTematicoType) => void;
  onDelete: (id: string) => void;
}

export default function EjeTematicoItem({ eje, onEdit, onDelete }: EjeTematicoItemProps) {
  return (
    <li className="flex justify-between items-center px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <p className="text-sm font-medium text-gray-900 dark:text-white">{eje.nombre}</p>
      <ItemActionMenu
        onEdit={() => onEdit(eje)}
        onDelete={() => onDelete(eje.id!)}
      />
    </li>
  );
}
