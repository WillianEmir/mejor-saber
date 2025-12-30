# Contexto del Proyecto: Aplicación de Preparación para Pruebas SABER 11

Este documento proporciona un resumen del proyecto "app-saber-11", una aplicación de preparación para las Pruebas SABER 11 en Colombia.

## 1. Propósito General de la Aplicación

La aplicación está diseñada para ayudar a los estudiantes a prepararse para las Pruebas SABER 11, ofreciendo simulacros de examen, acceso a contenidos curriculares y seguimiento de progreso.

## 2. Roles de Usuario y Funcionalidades

### 2.1. Usuario Estudiante (`USER`)

Los usuarios estudiantes tienen dos modalidades:

*   **Usuario Gratuito (`isActive: false`)**:
    *   Acceso a 2 simulacros por cada "competencia" (ej. Matemáticas, Lectura Crítica, etc.).
    *   Acceso limitado a contenidos curriculares y ejes temáticos con sus actividades.
*   **Usuario de Pago (`isActive: true`)**:
    *   Acceso ilimitado a todos los simulacros por "competencia" y por "área".
    *   Acceso completo a todos los contenidos curriculares y la capacidad de realizar actividades de ejes temáticos, guardando su progreso en la base de datos.

**Afiliación**: Un usuario puede pertenecer a un colegio (asociado a `ADMINSCHOOL`) o ser un suscriptor independiente.

**Dashboard**: Toda la información generada por los simulacros y actividades se consume y muestra en un dashboard personalizado para el usuario.

### 2.2. Administrador de Colegio (`ADMINSCHOOL`)

El rol `ADMINSCHOOL` tiene acceso a una lectura más detallada y agregada de los resultados obtenidos por los estudiantes de un colegio específico. Su dashboard se centra en el rendimiento colectivo y análisis.

## 3. Características Clave de la Aplicación

*   **Simulacros de Examen**: Por competencia y por área.
*   **Contenidos Curriculares**: Material de estudio organizado.
*   **Actividades por Ejes Temáticos**: Ejercicios interactivos con seguimiento de progreso.
*   **Dashboards de Seguimiento**: Visualización del rendimiento y progreso del usuario y/o del colegio.
*   **Autenticación**: Gestión de usuarios y sesiones.
*   **Integración de Pagos**: Posibilidad de suscripción (ej. a través de MercadoPago).
*   **Gestión de Colegios**: Asociación de estudiantes a instituciones educativas.

## 4. Tecnologías y Estructura (Basado en el análisis de carpetas y contexto)

El proyecto parece ser una aplicación Next.js con TypeScript, utilizando Prisma para la gestión de la base de datos y un entorno de desarrollo moderno (eslint, jest, tailwindcss).

**Estructura de Directorios Relevante**:

*   `app/`: Contiene las rutas de la aplicación, incluyendo:
    *   `(landingpage)`: Páginas de marketing/información pública.
    *   `api`: Endpoints de la API (autenticación, pagos, webhooks).
    *   `auth`: Rutas de autenticación (signin, signup, reset-password).
    *   `dashboard`: Secciones del panel de control para usuarios, con subdirectorios para `admin`, `user`, `payment`, `profile`, `school`, etc.
*   `prisma/`: Esquema de la base de datos (`schema.prisma`) y migraciones.
*   `src/lib/`: Utilidades y lógica de negocio (ej. `prisma.ts`, `mercadopago.ts`).
*   `src/components/`: Componentes UI reutilizables.
*   `__tests__/`: Pruebas de integración.

## 5. Propuesta de Gamificación (Contexto de Futuro Desarrollo)

Se ha propuesto la integración de una estrategia de gamificación tipo PBL (Puntos, Insignias, Tablas de Clasificación) para enriquecer la experiencia y motivar el uso. Esto implicaría:

*   **Puntos**: Recompensa por acciones (simulacros completados, puntajes altos, logins diarios).
*   **Niveles**: Basados en la acumulación de puntos.
*   **Insignias**: Reconocimiento de logros específicos (dominio de temas, constancia).
*   **Tablas de Clasificación**: Competencia entre usuarios (global y por colegio).
*   **Mejoras Potenciales**: Avatares, tienda virtual con "Saber-Puntos", misiones diarias/semanales, notificaciones proactivas, y un dashboard de gamificación para `ADMINSCHOOL`.