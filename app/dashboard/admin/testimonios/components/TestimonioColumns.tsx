'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Star } from 'lucide-react'; 

import { Button } from '@/src/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { TestimonioType } from '../lib/testimonio.schema';

export const TestimonioColumns: ColumnDef<TestimonioType>[] = [
  {
    accessorKey: 'user',
    header: 'Usuario',
    cell: ({ row }) => {
      const testimonio = row.original;
      return (
        <div className="font-medium">{`${testimonio.user.firstName} ${testimonio.user.lastName || ''}`}</div>
      );
    },
    filterFn: (row, id, value) => {
      const user = row.original.user;
      const fullName = `${user.firstName} ${user.lastName || ''}`.toLowerCase();
      return fullName.includes(String(value).toLowerCase());
    },
  },
  {
    accessorKey: 'rating',
    header: 'Calificación',
    cell: ({ row }) => {
      const rating = row.original.rating;
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          ))}
          {Array.from({ length: 5 - rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 text-gray-300" />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: 'comentario',
    header: 'Comentario',
    cell: ({ row }) => <div className="max-w-sm truncate">{row.original.comentario}</div>,
  },
  {
    accessorKey: 'publicado',
    header: 'Publicado',
    cell: ({ row }) => {
      const isPublished = row.original.publicado;
      return (
        <span
          className={`px-2 py-1 text-xs font-semibold rounded-full ${
            isPublished
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {isPublished ? 'Sí' : 'No'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const testimonio = row.original;
      const { onEdit, onDelete } = table.options.meta as {
        onEdit: (testimonio: TestimonioType) => void;
        onDelete: (id: string) => void;
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(testimonio)}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(testimonio.id)}
              className="text-red-600"
            >
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
