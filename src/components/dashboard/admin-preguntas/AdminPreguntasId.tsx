'use client'

import React, { useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/solid';

type Opcion = {
  texto: string;
  valor: boolean;
  retroalimentacion: string;
};

type OpcionesRespuesta = {
  a: Opcion;
  b: Opcion;
  c: Opcion;
  d: Opcion;
};

const saberes = {
  'Matemáticas': {
    componentes: ['Numérico-variacional', 'Geométrico-métrico', 'Aleatorio'],
    evidencias: [
      'Comprende y transforma la información cuantitativa y esquemática presentada en distintos formatos.',
      'Plantea y ejecuta estrategias para la solución de problemas que involucren información cuantitativa.',
      'Valida procedimientos y estrategias matemáticas utilizadas para dar solución a problemas.'
    ]
  },
  'Lectura Crítica': {
    componentes: ['Semántico', 'Sintáctico', 'Pragmático'],
    evidencias: [
      'Identifica y entiende los contenidos locales que conforman un texto.',
      'Comprende cómo se articulan las partes de un texto para darle un sentido global.',
      'Reflexiona a partir de un texto y evalúa su contenido.'
    ]
  },
  'Ciencias Naturales': {
    componentes: ['Biología', 'Física', 'Química', 'Ciencia, Tecnología y Sociedad (CTS)'],
    evidencias: [
      'Uso comprensivo del conocimiento científico.',
      'Explicación de fenómenos.',
      'Indagación.'
    ]
  },
  'Sociales y Ciudadanas': {
    componentes: ['Histórico-geográfico', 'Económico-político', 'Cultural'],
    evidencias: [
      'Pensamiento social.',
      'Interpretación y análisis de perspectivas.',
      'Pensamiento reflexivo y sistémico.'
    ]
  },
  'Inglés': {
    componentes: ['Lingüístico', 'Pragmático', 'Sociolingüístico'],
    evidencias: [
      'Identifica elementos lingüísticos para comprender textos.',
      'Comprende la función pragmática de los enunciados.',
      'Reconoce elementos socioculturales en los textos.'
    ]
  }
};

type AreaKey = keyof typeof saberes;

export default function AdminPreguntasId() {
  const [contexto, setContexto] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [enunciado, setEnunciado] = useState('');
  const [opciones, setOpciones] = useState<OpcionesRespuesta>({
    a: { texto: '', valor: false, retroalimentacion: '' },
    b: { texto: '', valor: false, retroalimentacion: '' },
    c: { texto: '', valor: false, retroalimentacion: '' },
    d: { texto: '', valor: false, retroalimentacion: '' },
  });
  const [evidencia, setEvidencia] = useState('');
  const [area, setArea] = useState<AreaKey | ''>('');
  const [componente, setComponente] = useState('');

  const handleOpcionChange = (key: keyof OpcionesRespuesta, field: keyof Opcion, value: string | boolean) => {
    setOpciones(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nuevaArea = e.target.value as AreaKey;
    setArea(nuevaArea);
    setComponente('');
    setEvidencia('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImagen(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para enviar los datos a la base de datos
    // Por ejemplo, usando fetch o axios
    const formData = new FormData();
    formData.append('contexto', contexto);
    if (imagen) formData.append('imagen', imagen);
    formData.append('enunciado', enunciado);
    formData.append('opciones', JSON.stringify(opciones));
    formData.append('evidencia', evidencia);
    // await fetch('/api/preguntas', { method: 'POST', body: formData });
    alert('Pregunta enviada');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white">Crear Nueva Pregunta</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
            Completa los campos para agregar una nueva pregunta a la base de datos.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="contexto" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Contexto</label>
              <div className="mt-2">
                <textarea id="contexto" name="contexto" rows={3} value={contexto} onChange={e => setContexto(e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500" />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">Describe la situación o información base para la pregunta.</p>
            </div>

            <div className="col-span-full">
              <label htmlFor="enunciado" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Enunciado</label>
              <div className="mt-2">
                <textarea id="enunciado" name="enunciado" rows={3} value={enunciado} onChange={e => setEnunciado(e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500" />
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">La pregunta específica que el estudiante debe responder.</p>
            </div>

            <div className="col-span-full">
              <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Imagen de Apoyo</label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-600 px-6 py-10">
                <div className="text-center">
                  {previewUrl ? (
                    <div>
                      <img src={previewUrl} alt="Vista previa de la imagen" className="mx-auto h-48 w-auto rounded-md" />
                      <button type="button" onClick={() => { setImagen(null); setPreviewUrl(null); }} className="mt-4 text-sm font-semibold text-red-600 hover:text-red-500">
                        Quitar imagen
                      </button>
                    </div>
                  ) : (
                    <>
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-500" aria-hidden="true" />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white dark:bg-gray-900 font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500 dark:text-indigo-400 dark:focus-within:ring-offset-gray-900">
                          <span>Sube un archivo</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <p className="pl-1">o arrástralo aquí</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600 dark:text-gray-400">PNG, JPG, GIF hasta 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Opciones de Respuesta</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Define las cuatro opciones de respuesta y marca cuál es la correcta.</p>
          <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2">
            {(['a', 'b', 'c', 'd'] as (keyof OpcionesRespuesta)[]).map(key => (
              <div key={key} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 shadow-sm">
                <strong className="text-lg font-medium text-gray-900 dark:text-white">Opción {key.toUpperCase()}</strong>
                <div className="mt-4 space-y-4">
                  <div>
                    <label htmlFor={`opcion-texto-${key}`} className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Texto de la opción</label>
                    <div className="mt-1">
                      <input type="text" id={`opcion-texto-${key}`} value={opciones[key].texto} onChange={e => handleOpcionChange(key, 'texto', e.target.value)} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`opcion-retro-${key}`} className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">Retroalimentación</label>
                    <div className="mt-1">
                      <input type="text" id={`opcion-retro-${key}`} value={opciones[key].retroalimentacion} onChange={e => handleOpcionChange(key, 'retroalimentacion', e.target.value)} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500" />
                    </div>
                  </div>
                  <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                      <input id={`opcion-valor-${key}`} type="checkbox" checked={opciones[key].valor} onChange={e => handleOpcionChange(key, 'valor', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 dark:bg-gray-700 dark:border-gray-600" />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                      <label htmlFor={`opcion-valor-${key}`} className="font-medium text-gray-900 dark:text-gray-300">Marcar como respuesta correcta</label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-b border-gray-900/10 dark:border-gray-700 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">Metadatos</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">Información adicional para clasificar y organizar la pregunta.</p>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full">
              <label htmlFor="evidencia" className="block text-sm font-medium leading-6 text-gray-900 dark:text-white">Evidencia</label>
              <div className="mt-2">
                <select 
                  id="evidencia" 
                  name="evidencia" 
                  value={evidencia} 
                  onChange={e => setEvidencia(e.target.value)} 
                  required 
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-600 dark:focus:ring-indigo-500"
                >
                  <option value="">Seleccione una opción</option>
                  <option value="">Opción1</option>
                  <option value="">Opción2</option>
                  <option value="">Opción3</option>
                </select>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600 dark:text-gray-400">Selecciona la evidencia o competencia que evalúa la pregunta.</p>
            </div>

            {/* Checkbox here */}
            
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
          Cancelar
        </button>
        <button type="submit" className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Insertar pregunta
        </button>
      </div>
    </form>
  );
}
