'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { SchoolSede, User } from '@/src/generated/prisma';

interface ReportFiltersProps {
  sedes: SchoolSede[];
  degrees: string[];
  studentList: Pick<User, 'id' | 'name' | 'lastName'>[];
  areaNames: string[];
  selectedSede: string;
  selectedDegree: string;
  selectedStudent: string;
  selectedAreaName: string;
  onSedeChange: (value: string) => void;
  onDegreeChange: (value: string) => void; 
  onStudentChange: (value: string) => void;
  onAreaChange: (value: string) => void;
  showAreaFilter?: boolean;
}

export default function ReportFilters({ 
  sedes, 
  degrees, 
  studentList, 
  areaNames, 
  selectedSede, 
  selectedDegree, 
  selectedStudent, 
  onSedeChange, 
  onDegreeChange, 
  onStudentChange, 
  onAreaChange,
  showAreaFilter = true
}: ReportFiltersProps) {
  return (
    <div className="flex gap-4 pt-4">
      <div className="flex-1">
        <Select onValueChange={onSedeChange} value={selectedSede}>
          <SelectTrigger><SelectValue placeholder="Seleccionar sede" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las sedes</SelectItem>
            {sedes.map(sede => (
              <SelectItem key={sede.id} value={sede.id}>{sede.nombre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Select onValueChange={onDegreeChange} value={selectedDegree}>
          <SelectTrigger><SelectValue placeholder="Seleccionar grado" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los grados</SelectItem>
            {degrees.map(degree => (
              <SelectItem key={degree} value={degree}>{degree}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1">
        <Select onValueChange={onStudentChange} value={selectedStudent} disabled={!selectedSede}>
          <SelectTrigger><SelectValue placeholder="Seleccionar estudiante" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estudiantes</SelectItem>
            {studentList.map(student => (
              <SelectItem key={student.id} value={student.id}>{`${student.name} ${student.lastName}`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {showAreaFilter && (
        <div className="flex-1">
          <Select onValueChange={onAreaChange} defaultValue="all">
            <SelectTrigger><SelectValue placeholder="Seleccionar área" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las áreas</SelectItem>
              {areaNames.map((name: string) => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
