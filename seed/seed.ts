
export interface OpcionRespuesta {
  estado: boolean;
  retroalimentacion: string;
  [key: string]: any; //TODO: Para permitir claves dinámicas como 'a', 'b', etc.
}

export interface Pregunta {
  contexto: string;
  imagen: string;
  enunciado: string;
  opcionesRespuesta: OpcionRespuesta[];
  queEvalua: string;
  competencia: string;
  afirmacion: string;
  evidencia: string;
  contenidoCurricular: string;
}

export interface ItemInventario {
  area: string;
  preguntas: Pregunta;
}

export const inventario: ItemInventario[] = [
  {
    area: 'matemáticas',
    preguntas: {
      contexto: '',
      imagen: '',
      enunciado: '',
      opcionesRespuesta: [
        { a: '', estado: false, retroalimentacion: '' },
        { b: '', estado: false, retroalimentacion: '' },
        { c: '', estado: true, retroalimentacion: '' },
        { d: '', estado: false, retroalimentacion: '' }
      ],
      queEvalua: '',
      competencia: '',
      afirmacion: '',
      evidencia: '',
      contenidoCurricular: ''
    }
  }
];