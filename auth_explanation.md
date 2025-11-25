# Explicación de la Lógica del archivo `auth.ts`

Claro. El archivo `auth.ts` es el cerebro de la autenticación de tu aplicación, configurado con la librería `next-auth` (ahora conocida como Auth.js). Te explico su lógica parte por parte:

### Resumen General

Este archivo define y configura **cómo los usuarios pueden iniciar sesión**, **cómo se gestionan sus sesiones** y **qué datos de usuario están disponibles** en la aplicación después de iniciar sesión.

---

### Desglose de la Configuración `NextAuth`

Todo se centra en el objeto que se pasa a la función `NextAuth`.

#### 1. `adapter: PrismaAdapter(prisma) as Adapter`

*   **Propósito**: Conectar `next-auth` con tu base de datos.
*   **Cómo funciona**: `next-auth` necesita un lugar para guardar la información de los usuarios, sus cuentas (por ejemplo, la cuenta de Google), y las sesiones activas. El `PrismaAdapter` actúa como un "traductor" que permite a `next-auth` usar tu cliente de Prisma para comunicarse con la base de datos y manejar las tablas `User`, `Account`, `Session`, etc.
*   **`as Adapter`**: Esta es la aserción de tipo que agregamos. Le dice a TypeScript que confíe en que el adaptador de Prisma es compatible con el tipo que `next-auth` espera, solucionando el error de tipos que tenías.

#### 2. `providers: [...]`

*   **Propósito**: Definir los **métodos de autenticación** que ofreces a tus usuarios. En tu caso, son dos:
    *   **a) `GoogleProvider`**:
        *   Permite a los usuarios iniciar sesión con su cuenta de Google (OAuth).
        *   Utiliza el `clientId` y `clientSecret` que obtienes de la consola de Google Cloud (guardados de forma segura en variables de entorno) para gestionar el flujo de autenticación con Google.
        *   Cuando un usuario inicia sesión con Google por primera vez, `next-auth` (usando el `PrismaAdapter`) creará automáticamente una entrada para ese usuario en tu tabla `User` de la base de datos.

    *   **b) `CredentialsProvider`**:
        *   Este es el clásico inicio de sesión con **email y contraseña**.
        *   La parte clave es la función `authorize`, que contiene la lógica para validar las credenciales del usuario:
            1.  **Validación de entrada**: Usa la librería `zod` para asegurarse de que el email y la contraseña recibidos son del tipo esperado (un email válido y un string). Es una buena práctica de seguridad.
            2.  **Búsqueda del usuario**: Busca en la base de datos si existe un usuario con el email proporcionado (`prisma.user.findUnique`).
            3.  **Verificación del usuario y contraseña**: Comprueba si el usuario existe y si tiene una contraseña guardada (podría no tenerla si se registró con Google).
            4.  **Comparación Segura de Contraseñas**: Usa `bcrypt.compare` para comparar la contraseña que el usuario acaba de escribir con el "hash" (la contraseña encriptada) que está guardado en la base de datos. **Nunca se comparan contraseñas en texto plano**.
            5.  **Resultado**: Si las contraseñas coinciden, devuelve el objeto `user`. Esto le dice a `next-auth` que la autenticación fue exitosa. Si algo falla (el usuario no existe, la contraseña es incorrecta), devuelve `null`.

#### 3. `session: {...}`

*   **Propósito**: Configurar cómo se manejan las sesiones de los usuarios.
*   **`strategy: "database"`**: Indica que la información de la sesión se guardará en la base de datos (en la tabla `Session`). La alternativa es `"jwt"` (JSON Web Tokens), donde la información se guarda en una cookie en el navegador del cliente. La estrategia de base de datos te da más control, como la capacidad de cerrar sesiones desde el servidor.
*   **`maxAge`**: Define el tiempo de vida de una sesión antes de que expire. Aquí está configurado para 24 horas.

#### 4. `pages: {...}`

*   **Propósito**: Personalizar las rutas de autenticación.
*   **`signIn: "/auth/signin"`**: Le dice a `next-auth` que tu página de inicio de sesión personalizada se encuentra en la ruta `/auth/signin`. Si un usuario no autenticado intenta acceder a una página protegida, será redirigido aquí en lugar de a la página por defecto de `next-auth`.

#### 5. `callbacks: {...}`

*   **Propósito**: Permite "engancharse" a ciertos eventos del flujo de autenticación para ejecutar lógica personalizada.
*   **`async session({ session, user })`**: Este callback se ejecuta cada vez que se consulta una sesión.
    *   **Su objetivo es enriquecer el objeto `session`** que se envía al cliente.
    *   Por defecto, la sesión no incluye todos los datos del usuario de la base de datos por seguridad. Aquí, estás tomando el objeto `user` (que viene de la base de datos) y añadiendo explícitamente `id`, `schoolId`, `role`, y otros campos al objeto `session.user`.
    *   Gracias a esto, en tus componentes de React puedes usar `useSession()` y acceder a `session.user.role` o `session.user.schoolId` directamente.

### Exportaciones

Finalmente, el archivo exporta:

*   `handlers`: Los manejadores de rutas API (`GET`, `POST`) que `next-auth` utiliza internamente. Estos se exponen en tu API en `app/api/auth/[...nextauth]/route.ts`.
*   `auth`: Una función para obtener la sesión del usuario en el lado del servidor (en Server Components, API Routes, etc.).
*   `signIn`, `signOut`: Funciones que puedes llamar desde el lado del cliente (en tus componentes de React) para iniciar o cerrar la sesión.

---

### En Resumen (Analogía)

Piensa en `auth.ts` como el **recepcionista de seguridad de un edificio (tu aplicación)**.

*   Los **`providers`** son las formas de identificación que acepta: un carnet de empleado (email/contraseña) o una identificación de socio (Google).
*   La función **`authorize`** es el recepcionista verificando que el carnet no sea falso y que la foto coincida.
*   El **`PrismaAdapter`** es el archivador donde el recepcionista guarda y consulta los registros de todos los empleados.
*   El **`callback session`** es el proceso de darle al empleado un pase de visitante con su nombre, departamento y nivel de acceso (`role`, `schoolId`) escritos en él, para que todos dentro del edificio sepan quién es y qué puede hacer.
*   La **`session`** es ese pase de visitante, que tiene una duración de 24 horas.