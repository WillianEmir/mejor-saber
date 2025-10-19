# Plan de Integración de Mercado Pago para Suscripciones

Este documento detalla los pasos para integrar Mercado Pago como pasarela de pagos para un modelo de suscripciones en el proyecto `app-saber-11`, construido con Next.js, Prisma y NextAuth.

---

### Fase 1: Configuración Inicial y Prerrequisitos

1.  **Crear Cuenta de Vendedor en Mercado Pago:**
    *   Ve a [Mercado Pago](https://www.mercadopago.com.co) y crea una cuenta si aún no la tienes.
    *   Activa tu cuenta para recibir pagos (puede requerir validación de identidad y negocio).

2.  **Obtener Credenciales de API:**
    *   Dentro de tu panel de Mercado Pago, ve a la sección "Tu Negocio" -> "Configuración" -> "Credenciales".
    *   Necesitarás las credenciales de **Prueba** para desarrollar y las de **Producción** para el lanzamiento.
    *   Las credenciales clave son:
        *   `Public key`: Se usa en el frontend.
        *   `Access token`: Se usa en el backend (es secreto).

3.  **Instalar el SDK de Mercado Pago:**
    *   Abre tu terminal y ejecuta el siguiente comando para añadir el SDK de Node.js a tu proyecto:
        ```bash
        npm install mercadopago 
        ```

4.  **Configurar Variables de Entorno:**
    *   Crea o modifica tu archivo `.env.local` en la raíz del proyecto.
    *   Añade tus credenciales de Mercado Pago. **Nunca las expongas directamente en el código.**
        ```env
        # Mercado Pago
        MP_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxxxxxx
        MP_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
        MP_WEBHOOK_SECRET=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx # Lo crearás más adelante

        # URL de tu aplicación
        NEXT_PUBLIC_APP_URL=http://localhost:3000
        ```

---

### Fase 2: Actualización del Modelo de Datos (Prisma)

Necesitamos guardar el estado de la suscripción de cada usuario en nuestra base de datos.

1.  **Modificar `schema.prisma`:**
    *   Abre `prisma/schema.prisma` y añade un nuevo modelo `Subscription` y una relación con el modelo `User`.

    ```prisma
    // En tu modelo User, añade la relación
    model User {
      // ... otros campos
      subscription Subscription?
    }

    // Añade este nuevo modelo
    model Subscription {
      id                        String    @id @default(cuid())
      userId                    String    @unique
      user                      User      @relation(fields: [userId], references: [id])

      mercadoPagoSubscriptionId String    @unique
      mercadoPagoPlanId         String
      status                    String    // e.g., "active", "paused", "cancelled"
      
      currentPeriodEnd          DateTime
      createdAt                 DateTime  @default(now())
      updatedAt                 DateTime  @updatedAt
    }
    ```

2.  **Ejecutar la Migración de la Base de Datos:**
    *   Guarda el archivo `schema.prisma` y ejecuta el siguiente comando para aplicar los cambios a tu base de datos:
        ```bash
        npx prisma migrate dev --name add_subscription_model
        ```

---

### Fase 3: Desarrollo del Backend (API Routes)

Crearemos dos endpoints: uno para crear la suscripción y otro para recibir notificaciones (webhooks).

1.  **Endpoint de Creación de Suscripción:**
    *   Crea el archivo: `app/api/subscriptions/route.ts`.
    *   **Lógica:**
        *   Debe ser una ruta protegida (verificar la sesión del usuario con NextAuth).
        *   Recibe el `planId` desde el frontend.
        *   Usa el SDK de Mercado Pago para crear una suscripción.
        *   Guarda el ID y estado de la suscripción en tu base de datos (en el modelo `Subscription`).
        *   Devuelve la URL de checkout (`init_point`) al frontend.

2.  **Endpoint de Webhooks:**
    *   Crea el archivo: `app/api/webhooks/mercadopago/route.ts`.
    *   **Lógica:**
        *   Recibe notificaciones de eventos desde Mercado Pago (pagos aprobados, rechazados, suscripciones canceladas, etc.).
        *   **Verifica la firma del webhook** para asegurar que la petición es legítima.
        *   Actualiza el estado de la `Subscription` en tu base de datos según el evento recibido. Esto es **crucial** para mantener tu sistema sincronizado.
    *   En el panel de Mercado Pago, en la sección de Webhooks, configura la URL de este endpoint: `https://tu-dominio.com/api/webhooks/mercadopago`.

---

### Fase 4: Desarrollo del Frontend (React Components)

1.  **Crear Página de Planes/Precios:**
    *   Diseña un componente en `app/(landingpage)/precios/page.tsx` que muestre los planes disponibles (ej. Mensual, Anual).
    *   Cada plan debe tener un botón "Suscribirme".

2.  **Implementar Lógica de Suscripción:**
    *   Al hacer clic en "Suscribirme", el frontend debe:
        *   Hacer una petición `POST` a tu endpoint `/api/subscriptions`.
        *   Enviar el identificador del plan seleccionado.
        *   Al recibir la respuesta, si es exitosa, redirigir al usuario a la URL `init_point` que te devolvió el backend.

3.  **Crear Página de Gestión de Suscripción:**
    *   En el dashboard del usuario (`app/dashboard/profile/page.tsx` o una nueva página), muestra el estado actual de su suscripción.
    *   Lee esta información desde tu base de datos.
    *   Proporciona un botón para que el usuario pueda gestionar su suscripción (cancelar, cambiar método de pago). Mercado Pago ofrece un link para esto.

---

### Fase 5: Proteger Contenido Premium

Ahora que sabes qué usuarios tienen una suscripción activa, puedes restringir el acceso a ciertas partes de tu aplicación.

1.  **Middleware:**
    *   Modifica `middleware.ts` para proteger rutas completas (ej. `/dashboard/material-estudio`). El middleware puede verificar si el usuario tiene una suscripción activa en la base de datos.

2.  **Componentes de Servidor:**
    *   Dentro de los componentes de servidor, puedes hacer una llamada a la base de datos para verificar el estado de la suscripción y mostrar contenido condicionalmente.

3.  **Componentes de Cliente:**
    *   Actualiza el hook `use-current-user.ts` para que también devuelva el estado de la suscripción. Esto permitirá a los componentes del lado del cliente reaccionar dinámicamente.

---

### Fase 6: Pruebas (Testing)

1.  **Usar Credenciales de Prueba:** Asegúrate de que todas tus variables de entorno apunten a las credenciales de prueba de Mercado Pago.
2.  **Tarjetas de Prueba:** Mercado Pago proporciona números de tarjetas de crédito de prueba para simular diferentes escenarios (pagos aprobados, rechazados).
3.  **Flujo Completo:** Realiza una prueba completa:
    *   Un usuario se suscribe.
    *   Verifica que es redirigido al checkout de Mercado Pago.
    *   Completa el pago con una tarjeta de prueba.
    *   Verifica que el webhook actualiza el estado en tu base de datos a "active".
    *   Verifica que el usuario ahora tiene acceso al contenido premium.
    *   Simula la cancelación de la suscripción desde el panel de Mercado Pago y verifica que el acceso es revocado.

---

### Fase 7: Puesta en Producción (Go-Live)

1.  **Cambiar Credenciales:** Reemplaza las credenciales de `Prueba` por las de `Producción` en tus variables de entorno del servidor de producción.
2.  **Configurar Webhook de Producción:** Actualiza la URL del webhook en el panel de Mercado Pago a tu dominio de producción.
3.  **Crear Planes en Producción:** Asegúrate de haber creado los mismos planes de suscripción en el modo de producción de Mercado Pago.
4.  **¡Lanzamiento!**
