# Guía del Sistema de Autenticación del Proyecto

Este documento explica paso a paso cómo funciona el sistema de autenticación de tu aplicación. El sistema está construido con **Next.js**, **NextAuth.js (v4)**, y **Prisma** como ORM para la base de datos.

La autenticación se basa en el método de **"Credenciales"**, lo que significa que la aplicación gestiona sus propias cuentas de usuario (email y contraseña) en lugar de usar proveedores externos como Google o Facebook.

---

## Flujo General de Autenticación

1.  **Usuario**: Intenta acceder a una página protegida (ej. `/dashboard`).
2.  **Middleware**: Intercepta la petición, ve que el usuario no está autenticado y lo redirige a la página de inicio de sesión (`/dashboard/auth/signin`).
3.  **Frontend**: El usuario rellena el formulario con su email/contraseña y hace clic en "Iniciar Sesión". El cliente llama a la función `signIn('credentials', ...)` de NextAuth.js.
4.  **Backend (API)**: La petición llega al endpoint `/api/auth/[...nextauth]/route.ts`.
5.  **NextAuth.js Core**: Invoca la función `authorize` que has definido en el `CredentialsProvider`.
6.  **Authorize Function**:
    *   Busca al usuario en la base de datos por su email.
    *   Compara la contraseña enviada con el hash guardado en la base de datos usando `bcrypt`.
    *   Si la contraseña es correcta, devuelve el objeto de usuario.
7.  **JWT y Sesión**: NextAuth.js genera un JSON Web Token (JWT) con los datos del usuario y lo guarda en una cookie segura (http-only).
8.  **Redirección**: El frontend recibe la confirmación de éxito y redirige al usuario a la página que originalmente quería visitar (ej. `/dashboard`).
9.  **Acceso Autorizado**: Ahora, cuando el usuario navega por las páginas protegidas, el `middleware` y las funciones del lado del servidor pueden validar la sesión a través de la cookie JWT.

---

## Paso 1: El Modelo de Datos (Base de Datos)

Todo comienza con el modelo `User` en tu `schema.prisma`. Aquí es donde se define la estructura de los datos de un usuario que se guardarán en la base de datos.

`prisma/schema.prisma`:
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  password      String  // <-- Aquí se guarda el hash de la contraseña
  firstName     String?
  lastName      String?
  isActived     Boolean   @default(false)
  avatar        String?
  phone         String?
  dateIsActived DateTime? @map("date_is_actived")

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  rol       Rol      @default(USER) // <-- Rol para autorización

  simulacros       Simulacro[]
  UserSubscription UserSubscription[]

  @@map("users")
}
```
**Puntos Clave:**
- El campo `password` no guarda la contraseña en texto plano, sino un "hash" generado por `bcrypt`. Esto es una práctica de seguridad crucial.
- El campo `rol` (`USER` o `ADMIN`) es fundamental para la **autorización** (decidir qué puede hacer un usuario una vez autenticado).

---

## Paso 2: La Lógica de Autenticación (Backend)

Esta es la parte central del sistema. Se encuentra en `app/api/auth/[...nextauth]/options.ts` y utiliza el `CredentialsProvider`.

`app/api/auth/[...nextauth]/options.ts`:
```typescript
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@/src/generated/prisma";
import * as bcrypt from "bcrypt";
import { z } from "zod"; 

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validar que las credenciales no son nulas
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          // 2. Buscar al usuario en la base de datos
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            return null; // Si no existe, la autenticación falla
          }

          // 3. Comparar la contraseña del formulario con el hash de la BD
          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // 4. Si coinciden, devolver el objeto de usuario
            return { id: user.id, email: user.email, name: user.name };
          }
        }
        // 5. Si las contraseñas no coinciden o los datos son inválidos, devolver null
        return null;
      },
    }),
  ],
  // ... resto de la configuración
};
```
La función `authorize` es el corazón de la autenticación por credenciales. Recibe los datos del formulario y es responsable de verificar si son válidos.

---

## Paso 3: El Formulario de Inicio de Sesión (Frontend)

El usuario interactúa con un formulario en el cliente. La lógica clave está en el componente `SignInForm`.

`src/components/dashboard/auth/SignInForm.tsx`:
```typescript
'use client';

import { signIn } from 'next-auth/react';
// ... otros imports

export default function SignInForm() {
  const router = useRouter();
  // ... otros hooks

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Aquí se llama a NextAuth.js
    const result = await signIn("credentials", {
      redirect: false, // Importante: manejamos la redirección manualmente
      email,
      password,
    });

    if (result?.error) {
      setLoading(false);
      // Mostrar un error si la autenticación falló
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('error', 'CredentialsSignin');
      router.push(newUrl.toString());
    } else {
      // Si tuvo éxito, redirigir al dashboard
      router.push(callbackUrl);
    }
  };

  return (
    // ... JSX del formulario
  );
}
```
**Puntos Clave:**
- Se usa `signIn('credentials', ...)` para iniciar el flujo. El primer argumento `"credentials"` debe coincidir con el proveedor configurado en el backend.
- `redirect: false` permite controlar el flujo en el cliente, mostrando mensajes de error o animaciones de carga sin un refresco de página completo.

---

## Paso 4: Gestión de la Sesión con JWT

Una vez que `authorize` devuelve un usuario, NextAuth.js necesita persistir esa sesión. Tu configuración usa JSON Web Tokens (JWT).

`app/api/auth/[...nextauth]/options.ts`:
```typescript
export const authOptions: AuthOptions = {
  // ... providers
  session: {
    strategy: "jwt", // Indica que no se usará la base de datos para las sesiones
  },
  pages: {
    signIn: "/dashboard/auth/signin", // Página de login personalizada
  },
  callbacks: {
    // Se ejecuta al crear/actualizar el JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Añade el ID del usuario al token
      }
      return token;
    },
    // Se ejecuta al acceder a la sesión desde el cliente
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; // Añade el ID del token al objeto de sesión
      }
      return session;
    },
  },
};
```
**Puntos Clave:**
- **`strategy: "jwt"`**: Es más rápido y no requiere lecturas a la base de datos en cada petición para validar la sesión. La información del usuario se codifica en el propio token.
- **`callbacks`**: Son esenciales para personalizar el contenido del JWT y del objeto `session`. Aquí, se usan para asegurar que el `id` del usuario esté disponible tanto en el token como en el objeto de sesión que se usa en el cliente.

---

## Paso 5: Protección de Rutas (Middleware)

El archivo `middleware.ts` actúa como un guardia de seguridad para tus rutas.

`middleware.ts`:
```typescript
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/admin/:path*",
    "/dashboard/ejercicios-practica/:path*",
    "/dashboard/material-estudio/:path*",
    "/dashboard/mi-progreso/:path*",
    "/dashboard/profile/:path*",
    "/dashboard/simulacros/:path*",
  ],
};
```
**Puntos Clave:**
- Es simple y declarativo. Importa el middleware por defecto de `next-auth`.
- El objeto `config.matcher` le dice al middleware qué rutas debe proteger. Cualquier intento de acceso a estas rutas sin una sesión válida resultará en una redirección a la página de `signIn` definida en `options.ts`.
