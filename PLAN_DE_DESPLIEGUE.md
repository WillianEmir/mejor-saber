# Plan de Despliegue: Next.js + Prisma en Vercel y Neon

Este documento detalla los pasos para desplegar una aplicación Next.js que utiliza Prisma como ORM, alojando la base de datos en Neon y la aplicación en Vercel.

---

## Parte 1: Configuración de la Base de Datos en Neon

El primer paso es configurar nuestra base de datos PostgreSQL en la nube.

1.  **Crear una Cuenta en Neon:**
    *   Ve a [neon.tech](https://neon.tech/) y regístrate para obtener una cuenta. El plan gratuito es muy generoso.

2.  **Crear un Nuevo Proyecto:**
    *   Dentro de tu dashboard de Neon, crea un nuevo proyecto.
    *   Asígnale un nombre (ej: `app-saber-11-prod`).
    *   Selecciona la versión de PostgreSQL y la región que prefieras (idealmente, la más cercana a donde estará alojada tu aplicación en Vercel, ej: `US East (N. Virginia)`).

3.  **Obtener la URL de Conexión de Prisma:**
    *   Una vez creado el proyecto, ve a la sección "Connection Details" o "Conexión".
    *   Neon proporciona varias URLs de conexión. **Copia la URL específica para Prisma que incluye `pgbouncer=true`**. Es crucial para gestionar las conexiones en un entorno serverless como Vercel.
    *   Tendrá un formato similar a este:
        ```
        prisma://user:password@ep-plain-scab-123456.us-east-2.aws.neon.tech/dbname?pgbouncer=true
        ```
    *   Guarda esta URL de forma segura, la necesitarás en varios pasos. **Esta es tu variable `DATABASE_URL` de producción.**

4.  **Aplicar el Esquema de la Base de Datos:**
    *   Antes de que tu aplicación pueda usar la base de datos, esta debe tener la estructura correcta. Debes aplicar tus migraciones de Prisma a la base de datos de Neon.
    *   Abre tu terminal **en tu máquina local**.
    *   Ejecuta el siguiente comando, reemplazando `<TU_DATABASE_URL_DE_NEON>` con la URL que copiaste en el paso anterior:
        ```bash
        DATABASE_URL="<TU_DATABASE_URL_DE_NEON>" npx prisma migrate deploy
        ```
    *   Este comando ejecutará todas las migraciones existentes en tu carpeta `prisma/migrations` contra la base de datos de Neon, dejándola lista.

---

## Parte 2: Despliegue de la Aplicación en Vercel

Ahora que la base de datos está lista, vamos a desplegar la aplicación Next.js.

1.  **Subir tu Código a un Repositorio Git:**
    *   Asegúrate de que todo tu código esté actualizado en un repositorio de Git (GitHub, GitLab o Bitbucket). Vercel se conecta directamente a estos servicios.

2.  **Crear una Cuenta en Vercel:**
    *   Ve a [vercel.com](https://vercel.com/) y regístrate, preferiblemente usando tu cuenta de Git (GitHub, etc.).

3.  **Importar tu Proyecto:**
    *   En tu dashboard de Vercel, haz clic en "Add New..." -> "Project".
    *   Busca e importa el repositorio de tu aplicación.

4.  **Configurar el Proyecto:**
    *   Vercel detectará automáticamente que es un proyecto Next.js y pre-configurará la mayoría de las opciones.
    *   La parte más importante es configurar las **variables de entorno**.

5.  **Añadir Variables de Entorno:**
    *   En la configuración del proyecto en Vercel, ve a la pestaña "Settings" y luego a "Environment Variables".
    *   Crea una nueva variable:
        *   **Key:** `DATABASE_URL`
        *   **Value:** Pega la URL de conexión de Prisma/Neon que copiaste anteriormente.
    *   Asegúrate de que la variable esté disponible para los entornos de "Production", "Preview" y "Development".

6.  **Configurar el Comando de Build (Opcional pero Recomendado):**
    *   Para asegurar que tu base de datos se migre automáticamente con cada despliegue, puedes modificar el comando de build.
    *   En la configuración del proyecto, ve a "Settings" -> "General" -> "Build & Development Settings".
    *   Activa la opción para sobreescribir el "Build Command" y establece el siguiente valor:
        ```bash
        prisma generate && npx prisma migrate deploy && next build
        ```
    *   **Explicación:**
        *   `prisma generate`: Genera el cliente de Prisma.
        *   `npx prisma migrate deploy`: Aplica cualquier nueva migración a la base de datos de producción.
        *   `next build`: Construye tu aplicación Next.js.

7.  **Desplegar:**
    *   Con toda la configuración lista, haz clic en el botón "Deploy".
    *   Vercel clonará tu repositorio, instalará las dependencias, ejecutará el comando de build (incluyendo la migración de la base de datos) y desplegará tu aplicación.
    *   Una vez finalizado, Vercel te proporcionará la URL pública de tu proyecto.

---

## Flujo de Trabajo Post-Despliegue

Una vez que todo esté configurado, tu flujo de trabajo será muy sencillo:

1.  Desarrolla nuevas funcionalidades o arregla bugs en tu máquina local.
2.  Crea nuevas migraciones de base de datos con `npx prisma migrate dev` si es necesario.
3.  Sube tus cambios al repositorio con `git push`.
4.  Vercel detectará automáticamente el `push`, iniciará un nuevo despliegue, aplicará las migraciones a la base de datos de Neon y pondrá en línea la nueva versión de tu aplicación.
¡Listo! Tu aplicación estará desplegada y funcionando.
