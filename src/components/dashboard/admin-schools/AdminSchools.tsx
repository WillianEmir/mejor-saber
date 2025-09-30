'use client';

import { useState } from 'react';
import { SchoolWithSedesType, SchoolType, SchoolSedeType } from '@/src/lib/schemas/school.schema';
import SchoolModal from './SchoolModal';
import SedeModal from './SedeModal';
import { deleteSchool, deleteSchoolSede } from '@/src/lib/actions/school.action';
import { toast } from 'react-toastify';

interface AdminSchoolsProps {
  schools: SchoolWithSedesType[];
}

export default function AdminSchools({ schools }: AdminSchoolsProps) {
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isSedeModalOpen, setIsSedeModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolType | undefined>(undefined);
  const [selectedSede, setSelectedSede] = useState<SchoolSedeType | undefined>(undefined);
  const [selectedSchoolForSede, setSelectedSchoolForSede] = useState<string | undefined>(undefined);
  const [openAccordionId, setOpenAccordionId] = useState<string | null>(null);

  const handleOpenSchoolModal = (school?: SchoolType) => {
    setSelectedSchool(school);
    setIsSchoolModalOpen(true);
  };

  const handleCloseSchoolModal = () => {
    setIsSchoolModalOpen(false);
    setSelectedSchool(undefined);
  };

  const handleOpenSedeModal = (schoolId: string, sede?: SchoolSedeType) => {
    setSelectedSchoolForSede(schoolId);
    setSelectedSede(sede);
    setIsSedeModalOpen(true);
  };

  const handleCloseSedeModal = () => {
    setIsSedeModalOpen(false);
    setSelectedSede(undefined);
    setSelectedSchoolForSede(undefined);
  };

  const handleDeleteSchool = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta institución?')) {
      const response = await deleteSchool(id);
      toast.success(response.message);
    }
  };

  const handleDeleteSchoolSede = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta sede?')) {
      const response = await deleteSchoolSede(id);
      toast.success(response.message);
    }
  };

  const handleToggleAccordion = (schoolId: string) => {
    if (openAccordionId === schoolId) {
      setOpenAccordionId(null);
    } else {
      setOpenAccordionId(schoolId);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Instituciones Educativas</h1>
        <button
          onClick={() => handleOpenSchoolModal()}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Crear Institución
        </button>
      </div>

      <div className="space-y-4">
        {schools.map((school) => (
          <div key={school.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <div
              className="bg-white p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => handleToggleAccordion(school.id)}
            >
              <div className="flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">{school.nombre}</h2>
                <p className="text-xs text-gray-500">DANE: {school.DANE}</p>
              </div>
              <div className="flex items-center space-x-4 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenSchoolModal(school);
                  }}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Editar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSchool(school.id);
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-300 ${openAccordionId === school.id ? 'rotate-180' : ''
                      }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {openAccordionId === school.id && (
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-semibold text-gray-700">Sedes</h3>
                  <button
                    onClick={() => handleOpenSedeModal(school.id)}
                    className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Añadir Sede
                  </button>
                </div>
                {school.sedes.length > 0 ? (
                  <ul className="space-y-2">
                    {school.sedes.map((sede) => (
                      <li key={sede.id} className="flex justify-between items-center p-3 bg-white rounded-md border">
                        <div>
                          <p className="font-medium text-gray-800">{sede.nombre}</p>
                          <p className="text-xs text-gray-500">DANE: {sede.DANE}</p>
                        </div>
                        <div className='flex gap-2'>
                          <button
                            onClick={() => handleOpenSedeModal(school.id, sede)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSchoolSede(sede.id);
                            }}
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                          >
                            Eliminar
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No hay sedes registradas para esta institución.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isSchoolModalOpen && (
        <SchoolModal
          school={selectedSchool}
          isOpen={isSchoolModalOpen}
          onClose={handleCloseSchoolModal}
        />
      )}

      {isSedeModalOpen && selectedSchoolForSede && (
        <SedeModal
          schoolId={selectedSchoolForSede}
          sede={selectedSede}
          isOpen={isSedeModalOpen}
          onClose={handleCloseSedeModal}
        />
      )}
    </div>
  );
}