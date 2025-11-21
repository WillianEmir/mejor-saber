import React from 'react'

export default function TerminosCondiciones() {
  const today = new Date()
  const lastUpdated = today.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            Última actualización: {lastUpdated}
          </p>
        </div>

        <div className="space-y-8 text-lg leading-relaxed">
          <p>
            Bienvenido a nuestra plataforma de preparación para la prueba Saber 11 (en adelante, la &quot;Plataforma&quot;). Antes de utilizar nuestros servicios, te pedimos que leas detenidamente los siguientes Términos y Condiciones.
          </p>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Aceptación de los Términos</h2>
            <p>
              Al registrarte, acceder o utilizar la Plataforma, manifiestas que has leído, comprendido y aceptado vincularte a estos Términos y Condiciones, así como a nuestra Política de Tratamiento de Datos Personales. Si no estás de acuerdo, no debes utilizar el servicio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Descripción del Servicio</h2>
            <p>
              La Plataforma ofrece un servicio educativo en línea que incluye simulacros de la prueba Saber 11, preguntas por áreas de conocimiento, material de estudio, análisis de resultados y seguimiento del progreso personal, con el fin de preparar a los estudiantes para dicho examen.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Cuentas de Usuario</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Para acceder a la mayoría de las funciones, debes crear una cuenta proporcionando información veraz y completa.</li>
              <li>Eres el único responsable de mantener la confidencialidad de tu contraseña y de toda la actividad que ocurra en tu cuenta.</li>
              <li>Te comprometes a notificar inmediatamente cualquier uso no autorizado de tu cuenta.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Uso Aceptable de la Plataforma</h2>
            <p>
              Te comprometes a utilizar la Plataforma exclusivamente para fines personales y educativos. Están estrictamente prohibidas las siguientes actividades:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>Reproducir, distribuir, vender o explotar comercialmente el contenido.</li>
              <li>Utilizar robots, arañas u otros medios automatizados para acceder al servicio.</li>
              <li>Intentar descompilar, realizar ingeniería inversa o descifrar el software de la Plataforma.</li>
              <li>Usar el servicio para cualquier propósito ilegal o no autorizado.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Propiedad Intelectual</h2>
            <p>
              Todo el contenido disponible en la Plataforma, incluyendo textos, preguntas, gráficos, logos, software y material de estudio, es propiedad exclusiva de la Plataforma o de sus licenciantes y está protegido por las leyes de propiedad intelectual de Colombia. Se te concede una licencia limitada, no exclusiva y no transferible para usar el contenido con fines de estudio personal.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold my-6 text-center">6. Política de Tratamiento de Datos Personales (Habeas Data)</h2>
            <p>
              De conformidad con la Ley 1581 de 2012 y el Decreto 1377 de 2013, informamos nuestra política de tratamiento de datos:
            </p>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">6.1. Responsable del Tratamiento</h3>
            <p>El responsable del tratamiento de tus datos es [Nombre de la Empresa/Persona Responsable], con correo electrónico de contacto [correo@ejemplo.com].</p>

            <h3 className="text-xl font-semibold mt-4 mb-2">6.2. Datos Recopilados</h3>
            <p>Recolectamos datos personales como nombre, apellido, correo electrónico, fecha de nacimiento, e información académica como el colegio de procedencia. También recopilamos datos derivados del uso de la plataforma, como resultados de simulacros y progreso académico.</p>

            <h3 className="text-xl font-semibold mt-4 mb-2">6.3. Finalidad del Tratamiento</h3>
            <p>Tus datos serán utilizados para las siguientes finalidades:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Crear y gestionar tu cuenta de usuario.</li>
              <li>Personalizar tu experiencia de aprendizaje y mostrar tu progreso.</li>
              <li>Realizar análisis estadísticos anónimos para mejorar el servicio.</li>
              <li>Enviar comunicaciones transaccionales (ej. recuperación de contraseña) y notificaciones sobre el servicio.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">6.4. Tratamiento de Datos de Menores de Edad</h3>
            <p>
              Reconocemos que nuestra Plataforma será utilizada por menores de edad. El tratamiento de sus datos personales se realiza respetando siempre su interés superior y sus derechos fundamentales.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>La inscripción y el uso de la Plataforma por parte de un menor de edad debe contar con la autorización expresa y previa de sus padres o representantes legales.</strong></li>
              <li>Al crear una cuenta para un menor, el padre o representante legal declara que otorga dicha autorización y acepta estos términos en su nombre.</li>
              <li>Los datos recolectados no son de naturaleza sensible y su única finalidad es la prestación del servicio educativo.</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">6.5. Derechos del Titular</h3>
            <p>Como titular de los datos, tienes derecho a: conocer, actualizar, rectificar y suprimir tus datos, así como revocar la autorización otorgada. Para ejercer estos derechos, puedes enviar una solicitud al correo electrónico de contacto.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Limitación de Responsabilidad</h2>
            <p>
              La Plataforma se proporciona &quot;tal cual&quot;. No garantizamos un puntaje específico en la prueba Saber 11. Nuestro objetivo es ser una herramienta de apoyo, pero el resultado final depende del esfuerzo y dedicación del estudiante.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Ley Aplicable y Jurisdicción</h2>
            <p>
              Estos Términos se regirán e interpretarán de acuerdo con las leyes de la República de Colombia. Cualquier controversia derivada de su aplicación será sometida a la jurisdicción de los tribunales competentes de Colombia.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}