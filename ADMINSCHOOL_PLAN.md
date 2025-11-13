### **Objetivo General del Plan**

El objetivo es transformar el dashboard del `ADMINSCHOOL` en un centro de control completo que le permita no solo gestionar usuarios, sino también monitorear el desempeño de sus estudiantes, obtener analíticas valiosas y maximizar el valor que la plataforma ofrece a su institución.

### **Plan de Fortalecimiento para el Rol `ADMINSCHOOL`**

He dividido el plan en varias áreas clave de mejora:

---

#### **1. Dashboard Principal: Un Resumen Ejecutivo**

Actualmente, la sección de `ADMINSCHOOL` es muy básica. Propongo crear un dashboard principal que ofrezca una vista rápida y completa del estado de la institución en la plataforma.

*   **Ruta:** `/dashboard/school`
*   **Componentes:**
    *   **Tarjetas de Estadísticas (Stat Cards):**
        *   **Total de Estudiantes:** Conteo de usuarios con rol `USER`.
        *   **Total de Docentes:** Conteo de usuarios con rol `DOCENTE`.
        *   **Simulacros Realizados:** Total de simulacros completados por los estudiantes de la institución.
        *   **Puntaje Promedio General:** Media de los puntajes de todos los simulacros de la escuela.
    *   **Gráficos Interactivos:**
        *   **Distribución de Puntajes:** Un gráfico de barras (similar al que implementamos para el admin general) que muestre cómo se distribuyen los puntajes de los estudiantes de la institución.
        *   **Actividad Reciente:** Una lista con los últimos simulacros realizados por los estudiantes.
    *   **Acciones Rápidas:**
        *   Botones para "Añadir Estudiante", "Ver Reportes", "Exportar Datos".

---

#### **2. Gestión de Usuarios Avanzada**

Mejorar la gestión de usuarios para que sea más eficiente y potente, especialmente para instituciones con muchos estudiantes.

*   **Ruta:** `/dashboard/school/school-users` (la que acabamos de crear, pero mejorada).
*   **Funcionalidades:**
    *   **Importación Masiva de Usuarios:** Una de las funcionalidades más importantes para una institución. Permitir al `ADMINSCHOOL` subir un archivo (CSV o Excel) para crear o actualizar múltiples usuarios (estudiantes y docentes) de una sola vez.
    *   **Perfiles de Usuario Detallados:** Al hacer clic en un usuario, se podría ver una página con su información completa, historial de simulacros, puntajes y progreso a lo largo del tiempo.
    *   **Filtros y Búsqueda Avanzada:** Añadir filtros para ver solo estudiantes o docentes, y una barra de búsqueda para encontrar usuarios por nombre o email rápidamente.

---

#### **3. Centro de Reportes y Analíticas**

Esta es la sección que más valor aporta a las instituciones. Les permite medir el retorno de la inversión en la plataforma y entender el progreso de sus estudiantes.

*   **Ruta:** `/dashboard/school/reports`
*   **Funcionalidades:**
    *   **Reporte de Desempeño por Áreas y Competencias:**
        *   Mostrar el puntaje promedio de la institución en cada `Area` (Matemáticas, Lectura Crítica, etc.) y en cada `Competencia`.
        *   Permitiría a la escuela identificar fácilmente sus fortalezas y debilidades académicas.
    *   **Reporte de Progreso Individual:**
        *   Gráficos de líneas que muestren la evolución de los puntajes de un estudiante a través de los diferentes simulacros que ha presentado.
    *   **Ranking de Estudiantes:**
        *   Una tabla con los estudiantes de mayor puntaje en la institución (general o por área), para fomentar la competencia sana.
    *   **Exportación de Reportes:**
        *   Permitir que todos los reportes se puedan descargar en formato PDF o CSV para su análisis offline o para compartir en reuniones.

---

#### **4. Visibilidad del Contenido Educativo**

Permitir que el `ADMINSCHOOL` (y los `DOCENTES`) puedan explorar el material disponible en la plataforma.

*   **Ruta:** `/dashboard/school/content`
*   **Funcionalidades:**
    *   **Explorador de Contenido:** Una interfaz de solo lectura donde puedan navegar por los `ContenidosCurriculares`, `EjesTematicos` y ver ejemplos de `Preguntas`. Esto les da confianza en la calidad del material que sus estudiantes están utilizando.

---

### **Próximos Pasos**

Este es un plan completo y ambicioso. Mi recomendación es empezar por el **Dashboard Principal** (Punto 1), ya que sienta las bases y proporciona valor inmediato al `ADMINSCHOOL`. Luego, podríamos seguir con la **Importación Masiva de Usuarios** (Punto 2), que es una necesidad crítica para las escuelas.

¿Qué te parece el plan? ¿Por cuál de estas secciones te gustaría que empecemos a trabajar?