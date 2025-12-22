'use client';

import { useState, useTransition } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/src/components/ui/dialog';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/input';
import { toast } from 'sonner';
import { UserSchoolSchema, UserSchool } from '../_lib/user.schema';
import { ZodError } from 'zod';
import { ScrollArea } from '@/src/components/ui/scroll-area'; 
import { Badge } from '@/src/components/ui/badge';
import { bulkCreateUsers } from '../_lib/user.actions';
import { getSedesBySchoolId } from '../_lib/sede.actions';
import * as XLSX from 'xlsx';

interface UserImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
}

export default function UserImportModal({ isOpen, onClose, schoolId }: UserImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [parsedData, setParsedData] = useState<UserSchool[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<number, ZodError>>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const uploadedFile = event.target.files[0];
      const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(uploadedFile.type)) {
        toast.error('Por favor, sube un archivo CSV o XLSX.');
        return;
      }
      setFile(uploadedFile);
      setParsedData([]);
      setValidationErrors({});
    }
  };

  const handleDownloadTemplate = async () => {
    setIsGeneratingTemplate(true);
    try {
      const sedes = await getSedesBySchoolId(schoolId);
      if (sedes.length === 0) {
        toast.error('No se encontraron sedes para este colegio.', {
          description: 'Por favor, crea al menos una sede antes de descargar la plantilla.',
        });
        return;
      }

      const sedeNames = sedes.map(s => s.nombre);
      const headers = ["email", "name", "lastName", "idDocument", "sedeName", "degree"];
      
      const ws = XLSX.utils.aoa_to_sheet([headers]);
      
      // Create dropdown list for 'sedeName' column
      const sedeNameColumn = 'E'; // Column E
      ws['!dataValidation'] = [
        { 
          sqref: `${sedeNameColumn}2:${sedeNameColumn}200`, // Apply validation from E2 to E200
          opts: {
            type: 'list',
            allowBlank: false,
            formula1: `"${sedeNames.join(',')}"`,
            showDropDown: true,
            errorStyle: 'stop',
            errorTitle: 'Sede no válida',
            error: 'Por favor, selecciona una sede de la lista.',
            promptTitle: 'Seleccionar Sede',
            prompt: 'Elige una de las sedes disponibles en la lista desplegable.'
          }
        }
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Estudiantes");
      XLSX.writeFile(wb, "plantilla_estudiantes.xlsx");

    } catch (error) {
      toast.error('Error al generar la plantilla.');
      console.error(error);
    } finally {
      setIsGeneratingTemplate(false);
    }
  };

  const handleFileParse = () => {
    if (!file) {
      toast.error('Por favor, selecciona un archivo para importar.');
      return;
    }
    setIsParsing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];
        
        const newParsedData: UserSchool[] = [];
        const newErrors: Record<number, ZodError> = {};

        jsonData.forEach((row, index) => {
          const user = {
            email: row.email || '',
            name: row.name || '',
            lastName: row.lastName || '',
            role: 'USER', // Default role
            schoolId: schoolId,
            idDocument: row.idDocument ? String(row.idDocument) : undefined,
            sedeName: row.sedeName || undefined,
            degree: row.degree ? String(row.degree) : undefined,
          };
          
          // We'll rely on backend for final validation of sedeName
          const validation = UserSchoolSchema.safeParse(user);
          if (!validation.success) {
            newErrors[index] = validation.error;
          }
          newParsedData.push(user as UserSchool); // Cast needed due to schema difference
        });

        setParsedData(newParsedData);
        setValidationErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
          toast.warning(`Se encontraron ${Object.keys(newErrors).length} filas con errores. Por favor, corrígelas y vuelve a subir el archivo.`);
        } else {
          toast.success('Todos los datos son válidos y están listos para ser importados.');
        }
      } catch (error) {
        toast.error('Error al procesar el archivo Excel.');
        console.error(error);
      } finally {
        setIsParsing(false);
      }
    };
    reader.onerror = (error) => {
        toast.error('Error al leer el archivo.');
        console.error(error);
        setIsParsing(false);
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = () => {
    if (parsedData.length === 0 || Object.keys(validationErrors).length > 0) {
      toast.error('No hay datos válidos para importar.');
      return;
    }

    startTransition(async () => {
      const result = await bulkCreateUsers(parsedData);
      if (result.success) {
        toast.success(result.message);
        if (result.results.failedCount > 0) {
          toast.warning(`${result.results.failedCount} usuarios no se pudieron crear. Revisa los detalles.`, {
            description: (
              <ul className="list-disc pl-5">
                {result.results.errors.map((err, i) => <li key={i}><b>{err.email}:</b> {err.reason}</li>)}
              </ul>
            ),
          });
        }
        onClose();
      } else {
        toast.error(result.message);
      }
    });
  };

  const hasErrors = Object.keys(validationErrors).length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Importación Masiva de Estudiantes</DialogTitle>
          <DialogDescription>
            Sube un archivo XLSX con los datos de los estudiantes. Asegúrate de que las columnas coincidan con la plantilla.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grow overflow-y-auto p-1 space-y-4">
          <div className="flex items-center justify-between">
            <Input type="file" accept=".xlsx, .csv" onChange={handleFileChange} className="max-w-xs" />
            <div className='flex gap-2'>
              <Button variant="outline" onClick={handleDownloadTemplate} disabled={isGeneratingTemplate}>
                {isGeneratingTemplate ? 'Generando...' : 'Descargar Plantilla'}
              </Button>
              <Button onClick={handleFileParse} disabled={!file || isParsing || isPending}>
                {isParsing ? 'Procesando...' : 'Previsualizar Datos'}
              </Button>
            </div>
          </div>

          <ScrollArea className="border rounded-md h-96">
            {parsedData.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">Sede</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {parsedData.map((user, index) => (
                    <tr key={index} className={validationErrors[index] ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20'}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">
                        {validationErrors[index] ? (
                          <Badge variant="destructive">Error</Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-600">OK</Badge>
                        )}
                      </td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{(user as any).sedeName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Sube un archivo y haz clic en "Previsualizar Datos".</p>
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancelar</Button>
          <Button 
            type="button" 
            onClick={handleConfirmImport} 
            disabled={isParsing || parsedData.length === 0 || hasErrors || isPending}
          >
            {isPending ? 'Importando...' : `Confirmar Importación (${parsedData.length - Object.keys(validationErrors).length} usuarios)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
