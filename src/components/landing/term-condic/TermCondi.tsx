import React from 'react';

const TerminosYCondiciones = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-700 mb-6">
        Términos y Condiciones del Servicio
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Última actualización: 13 de agosto de 2025
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          1. Aceptación de los Términos
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Bienvenido a nuestra plataforma de simulacros de exámenes académicos. Al acceder o utilizar nuestro servicio, usted (el &quotUsuario&quot) acepta y se compromete a cumplir con los siguientes términos y condiciones (&quotTérminos&quot). Si no está de acuerdo con alguna parte de estos Términos, no debe usar nuestra plataforma.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          2. Descripción del Servicio
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Nuestra plataforma ofrece **simulacros de exámenes académicos**, diseñados específicamente para estudiantes de grado 11 en Colombia que se preparan para pruebas como el examen **ICFES Saber 11**. El servicio incluye acceso a preguntas, retroalimentación y resultados para ayudar en la preparación.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          3. Obligaciones del Usuario
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 leading-relaxed">
          <li>El Usuario se compromete a utilizar la plataforma únicamente para fines educativos y de preparación personal.</li>
          <li>Está prohibido compartir, distribuir, copiar o reproducir el contenido de los simulacros sin autorización.</li>
          <li>El Usuario es responsable de mantener la confidencialidad de su cuenta y contraseña.</li>
          <li>La información proporcionada al registrarse debe ser veraz y exacta.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          4. Propiedad Intelectual
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Todo el contenido de la plataforma, incluyendo preguntas, soluciones, diseño, logos y software, es propiedad exclusiva de nuestra empresa y está protegido por las leyes de propiedad intelectual de Colombia e internacionales. El uso del servicio no le otorga ningún derecho de propiedad sobre el contenido.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          5. Exclusión de Garantías y Limitación de Responsabilidad
        </h2>
        <p className="text-gray-700 leading-relaxed">
          El servicio se proporciona &quottal cual&quot y &quotsegún disponibilidad&quot. No garantizamos que los simulacros sean idénticos o que aseguren un resultado específico en el examen real. Nuestra responsabilidad se limita a la provisión del servicio, y no seremos responsables por daños indirectos, incidentales, especiales o consecuentes derivados del uso de la plataforma.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          6. Modificaciones de los Términos
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Nos reservamos el derecho de modificar estos Términos en cualquier momento. Las modificaciones entrarán en vigor tan pronto como sean publicadas en esta página. Es responsabilidad del Usuario revisar periódicamente los Términos para estar al tanto de las actualizaciones.
        </p>
      </section>

      <div className="mt-10 text-center">
        <p className="text-lg text-gray-800 font-medium">
          Al continuar usando la plataforma, usted acepta estos Términos y Condiciones.
        </p>
      </div>
    </div>
  );
};

export default TerminosYCondiciones;