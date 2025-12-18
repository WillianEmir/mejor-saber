# App-Saber-11: Plataforma de Preparación para el Examen Saber 11

## Descripción General

**App-Saber-11** es una plataforma de e-learning robusta y escalable, diseñada para ayudar a los estudiantes colombianos en su preparación para el examen de estado Saber 11. La aplicación ofrece un entorno completo con contenido curricular, simulacros de exámenes, seguimiento de progreso y un sistema de pagos integrado.

## Stack Tecnológico

La aplicación está construida con un stack de tecnologías moderno y eficiente:

- **Framework Frontend/Backend:** [Next.js](https://nextjs.org/) (con App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Autenticación:** [NextAuth.js](https://next-auth.js.org/)
- **Procesamiento de Pagos:** [Mercado Pago](https://www.mercadopago.com.co/)
- **UI y Estilos:** [Tailwind CSS](https://tailwindcss.com/)

## Características Principales

- **Gestión de Contenido Educativo:** Estructura jerárquica para Áreas, Ejes Temáticos y Contenidos Curriculares.
- **Simulacros y Evaluaciones:** Creación y realización de simulacros de examen basados en preguntas y opciones.
- **Autenticación y Autorización:** Sistema de registro e inicio de sesión con proveedores de credenciales (email/contraseña) y Google. Los roles de usuario (`ADMIN`, `USER`, `ADMINSCHOOL`) protegen las rutas y funcionalidades.
- **E-commerce Integrado:** Venta de productos (cursos/paquetes de simulacros) con un flujo de pago seguro a través de Mercado Pago.
- **Soporte para Colegios (Multi-tenancy):** Modelo de datos preparado para gestionar diferentes colegios, cada uno con sus propios administradores y usuarios.

## Estructura del Proyecto

El proyecto está organizado siguiendo las convenciones de Next.js, facilitando la mantenibilidad y escalabilidad.

```
.
├── app/                  # Lógica de la aplicación (App Router)
│   ├── (landingpage)/    # Rutas de la página de inicio
│   ├── api/              # Endpoints del backend (pagos, webhooks)
│   ├── auth/             # Páginas de autenticación (login, registro)
│   └── dashboard/        # Panel de control para usuarios y administradores
├── prisma/               # Esquema de la base de datos y migraciones
│   └── schema.prisma     # Definición de todos los modelos de datos
├── src/                  # Componentes, hooks, y librerías auxiliares
├── auth.ts               # Configuración central de NextAuth.js
├── next.config.ts        # Configuración de Next.js
└── package.json          # Dependencias y scripts del proyecto
```

## Guía de Instalación (Getting Started)

Sigue estos pasos para configurar y ejecutar el proyecto en tu entorno de desarrollo local.

**1. Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/app-saber-11.git
cd app-saber-11
```

**2. Instalar Dependencias**
```bash
npm install
```

**3. Configurar Variables de Entorno**

Crea un archivo `.env.local` en la raíz del proyecto, copiando el formato de `.env.example` (si existe). Deberás incluir las siguientes variables:

```env
# Base de Datos (PostgreSQL)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth.js
# Genera un secreto con: openssl rand -base64 32
NEXTAUTH_SECRET="tu-secreto-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Proveedor de Google
GOOGLE_CLIENT_ID="tu-client-id-de-google"
GOOGLE_CLIENT_SECRET="tu-client-secret-de-google"

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN="tu-access-token-de-mercado-pago"
```

**4. Aplicar Migraciones de la Base de Datos**

Asegúrate de que tu servidor de PostgreSQL esté corriendo y luego ejecuta el siguiente comando para crear las tablas en la base de datos.

```bash
npx prisma migrate dev
```

**5. Ejecutar el Servidor de Desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación en funcionamiento.

## Endpoints del API

La lógica de backend se gestiona a través de rutas API de Next.js. Las más importantes son:

- `POST /api/auth/[...nextauth]`: Maneja todas las operaciones de autenticación (inicio de sesión, registro, cierre de sesión) a través de NextAuth.js.
- `POST /api/payments/create-preference`: Crea una orden de compra en la base de datos con estado `PENDING` y genera una preferencia de pago en Mercado Pago.
- `POST /api/webhooks/mercadopago`: Recibe notificaciones de pago de Mercado Pago, verifica la transacción y actualiza el estado de la orden a `COMPLETED` de forma atómica.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.