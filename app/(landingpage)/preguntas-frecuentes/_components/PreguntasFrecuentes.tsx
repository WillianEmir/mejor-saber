'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/src/components/ui/accordion'

const faqData = [
  {
    id: 'item-1',
    question: '¿Qué es esta plataforma y para quién es?',
    answer:
      'Somos una plataforma de entrenamiento en línea diseñada para estudiantes de bachillerato en Colombia que deseen prepararse para la prueba de Estado Saber 11. Nuestro objetivo es ofrecer una herramienta completa y accesible para que puedas alcanzar un puntaje sobresaliente.',
  },
  {
    id: 'item-2',
    question: '¿Qué es la prueba Saber 11 y por qué es tan importante?',
    answer:
      'La prueba Saber 11 es un examen estandarizado que evalúa las competencias académicas de los estudiantes que están por finalizar la educación media. Es un requisito para graduarse y es el principal criterio de admisión para la mayoría de las universidades en Colombia, por lo que un buen resultado es clave para tu futuro académico y profesional.',
  },
  {
    id: 'item-3',
    question: '¿Qué áreas del conocimiento cubre la plataforma?',
    answer:
      'Nuestra plataforma cubre las cinco áreas fundamentales de la prueba Saber 11: Matemáticas, Lectura Crítica, Sociales y Ciudadanas, Ciencias Naturales (con sus componentes de Física, Química y Biología) e Inglés. El contenido está alineado con las competencias y temáticas definidas por el ICFES.',
  },
  {
    id: 'item-4',
    question: '¿Cómo funcionan los simulacros?',
    answer:
      'Los simulacros son réplicas de la prueba Saber 11 real en estructura, tiempo y tipo de preguntas. Al finalizar, recibirás un puntaje global y un desglose detallado por cada área de conocimiento, permitiéndote identificar tus fortalezas y debilidades para enfocar mejor tu estudio.',
  },
  {
    id: 'item-5',
    question: '¿Cómo se interpretan mis resultados y los niveles de desempeño?',
    answer:
      'Después de cada simulacro, te mostraremos un puntaje de 0 a 100 en cada área y un nivel de desempeño (Nivel 1, 2, 3 o 4). Estos niveles, basados en los criterios del ICFES, describen qué tan desarrolladas están tus competencias. Por ejemplo, en Matemáticas, un Nivel 4 indica que puedes resolver problemas complejos y modelar situaciones usando lenguaje algebraico.',
  },
  {
    id: 'item-6',
    question: '¿El contenido está actualizado con las guías del ICFES?',
    answer:
      'Sí. Nuestro equipo académico revisa y actualiza constantemente el banco de preguntas y el material de estudio para asegurar que todo el contenido esté alineado con las guías de orientación y los marcos de referencia más recientes publicados por el ICFES.',
  },
  {
    id: 'item-7',
    question: '¿Qué diferencia hay entre los contenidos "genéricos" y "no genéricos"?',
    answer:
      'Los contenidos "genéricos" se refieren a conocimientos fundamentales que todo ciudadano debería tener (ej. interpretar una gráfica). Los "no genéricos" son temas más específicos del currículo escolar (ej. teoremas como el de Pitágoras). La prueba evalúa ambos tipos, y nuestra plataforma te prepara para los dos.',
  },
  {
    id: 'item-8',
    question: '¿Cómo me preparan para la prueba de Lectura Crítica?',
    answer:
      'Te entrenamos en las tres competencias clave: 1) entender el contenido local de un texto, 2) comprender la estructura global y 3) reflexionar y evaluar su contenido. Practicarás con textos continuos (como ensayos y cuentos) y discontinuos (como caricaturas e infografías), tal como en la prueba real.',
  },
  {
    id: 'item-9',
    question: '¿Y para la prueba de Inglés?',
    answer:
      'La prueba de inglés se divide en 7 partes. Nuestra plataforma te familiariza con cada una de ellas, desde comprender descripciones y avisos (Partes 1 y 2) hasta completar conversaciones y textos complejos (Partes 3 a 7). El objetivo es mejorar tu competencia comunicativa según los niveles del Marco Común Europeo (A1, A2, B1).',
  },
  {
    id: 'item-10',
    question: '¿Cómo puedo registrarme en la plataforma?',
    answer:
      'Es muy fácil. Simplemente haz clic en el botón "Registrarse" en la parte superior de la página, completa el formulario con tus datos básicos y ¡listo! Recibirás un correo de confirmación para empezar a practicar de inmediato.',
  },
  {
    id: 'item-11',
    question: '¿La plataforma tiene algún costo?',
    answer:
      'Ofrecemos un plan gratuito con acceso a un número limitado de preguntas y un simulacro de diagnóstico. También contamos con planes de suscripción premium que te dan acceso ilimitado a todos los simulacros, material de estudio detallado y análisis de progreso avanzado.',
  },
  {
    id: 'item-12',
    question: '¿Puedo usar la plataforma en mi celular o tablet?',
    answer:
      '¡Claro que sí! La plataforma es completamente responsiva, lo que significa que puedes acceder a todo el contenido y realizar los simulacros desde cualquier dispositivo: computador, tablet o smartphone.',
  },
]

export default function PreguntasFrecuentes() {
  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
          Preguntas Frecuentes
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Aquí encontrarás respuestas a las dudas más comunes sobre nuestra plataforma y la prueba Saber 11.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqData.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left font-semibold text-lg">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-base text-gray-700 dark:text-gray-300">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}