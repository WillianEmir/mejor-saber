import prisma from '../src/lib/prisma'

async function main() {

  await prisma.pregunta.deleteMany()
  await prisma.evidencia.deleteMany()
  await prisma.afirmacion.deleteMany()
  await prisma.competencia.deleteMany()
  await prisma.area.deleteMany()

  await prisma.area.createMany({
    data: [
      { nombre: 'Matemáticas' },
      { nombre: 'Lectura Crítica' },
      { nombre: 'Sociales y Ciudadanas' },
      { nombre: 'Ciencias Naturales' },
      { nombre: 'Inglés' }
    ]
  })

  const matematicas = await prisma.area.findFirst({
    where: { nombre: 'Matemáticas' }
  })
  const lecturaCritica = await prisma.area.findFirst({
    where: { nombre: 'Lectura Crítica' }
  })
  const socialesCiudadanas = await prisma.area.findFirst({
    where: { nombre: 'Sociales y Ciudadanas' }
  })
  const cienciasNaturales = await prisma.area.findFirst({
    where: { nombre: 'Ciencias Naturales' }
  })
  const ingles = await prisma.area.findFirst({
    where: { nombre: 'Inglés' }
  })

  if (!matematicas) {
    throw new Error("No se encontró el área 'Matemáticas'");
  }
  if (!lecturaCritica) {
    throw new Error("No se encontró el área 'Matemáticas'");
  }
  if (!socialesCiudadanas) {
    throw new Error("No se encontró el área 'Matemáticas'");
  }
  if (!cienciasNaturales) {
    throw new Error("No se encontró el área 'Matemáticas'");
  }
  if (!ingles) {
    throw new Error("No se encontró el área 'Matemáticas'");
  }

  // MATEMÁTICAS
  await prisma.competencia.createMany({
    data: [
      {
        nombre: 'Interpretación y representación',
        areaId: matematicas.id
      },
      {
        nombre: 'Formulación y ejecución',
        areaId: matematicas.id
      },
      {
        nombre: 'Argumentación',
        areaId: matematicas.id
      }
    ]
  })

  const matematicasC = await prisma.area.findFirst({
    where: { nombre: 'Matemáticas' },
    include: {
      Competencia: true
    }
  })

  if (!matematicasC) {
    throw new Error("No se encontró el área 'Matemáticas'");
  }

  await prisma.afirmacion.createMany({
    data: [
      {
        nombre: 'Comprende y transforma la información cuantitativa y esquemática presentada en distintos formatos.',
        competenciaId: matematicasC.Competencia[0].id
      },
      {
        nombre: 'Frente a un problema que involucre información cuantitativa, plantea e implementa estrategias que lleven a soluciones adecuadas.',
        competenciaId: matematicasC.Competencia[1].id
      },
      {
        nombre: 'Valida procedimientos y estrategias matemáticas utilizadas para dar  solución a problemas.',
        competenciaId: matematicasC.Competencia[2].id
      }
    ]
  })

  const matematicasCA = await prisma.area.findFirst({
    where: { nombre: 'Matemáticas' },
    include: {
      Competencia: {
        include: {
          Afirmacion: true
        }
      }
    }
  })

  if (!matematicasCA) {
    throw new Error("No se encontró el área 'Matemáticas'");
  }

  await prisma.evidencia.createMany({
    data: [
      {
        nombre: 'Da cuenta de las características básicas de la información presentada en diferentes formatos, como series, gráficas, tablas y esquemas.',
        afirmacionId: matematicasCA.Competencia[0].Afirmacion[0].id
      },
      {
        nombre: 'Transforma la representación de una o más piezas de información.',
        afirmacionId: matematicasCA.Competencia[0].Afirmacion[0].id
      },
      {
        nombre: 'Diseña planes para la solución de problemas que involucran información cuantitativa o esquemática.',
        afirmacionId: matematicasCA.Competencia[1].Afirmacion[0].id
      },
      {
        nombre: 'Ejecuta un plan de solución para un problema que involucra información cuantitativa o esquemática.',
        afirmacionId: matematicasCA.Competencia[1].Afirmacion[0].id
      },
      {
        nombre: 'Resuelve un problema que involucra información cuantitativa o esquemática.',
        afirmacionId: matematicasCA.Competencia[1].Afirmacion[0].id
      },
      {
        nombre: 'Plantea afirmaciones que sustentan o refutan una interpretación dada a la información disponible en el marco de la solución de un problema.',
        afirmacionId: matematicasCA.Competencia[2].Afirmacion[0].id
      },
      {
        nombre: 'Argumenta a favor o en contra de un procedimiento para resolver un problema a la luz de criterios presentados o establecidos.',
        afirmacionId: matematicasCA.Competencia[2].Afirmacion[0].id
      },
      {
        nombre: 'Establece la validez o pertinencia de una solución propuesta a un problema dado.',
        afirmacionId: matematicasCA.Competencia[2].Afirmacion[0].id
      },
    ]
  })

  const matematicasCAE = await prisma.area.findFirst({
    where: { nombre: 'Matemáticas' },
    include: {
      Competencia: {
        include: {
          Afirmacion: {
            include: {
              Evidencia: true
            }
          }
        }
      }
    }
  })

  if (!matematicasCAE) {
    throw new Error("No se encontró el área 'Matemáticas'");
  }

  await prisma.pregunta.create({
    data: {
      contexto: 'Una persona que vive en Colombia tiene inversiones en dólares en Estados Unidos, y sabe que la tasa de cambio del dólar respecto al peso colombiano se mantendrá constante este mes, siendo 1 dólar equivalente a 2.000 pesos colombianos y que su inversión, en dólares, le dará ganancias del 3 % en el mismo periodo. Un amigo le asegura que en pesos sus ganancias también serán del 3 %.',
      imagen: 'nosotros.jpg',
      enunciado: 'La afirmación de su amigo es',
      opciones: [
        { a: '', estado: false, retroalimentacion: 'uno' },
        { b: '', estado: false, retroalimentacion: 'dos' },
        { c: '', estado: true, retroalimentacion: 'tres' },
        { d: '', estado: false, retroalimentacion: 'cuatro' }
      ],
      campoEvalua: 'Espacial',
      evidenciaId: matematicasCAE.Competencia[0].Afirmacion[0].Evidencia[0].id
    }
  })

  const pregunta = await prisma.pregunta.findFirst({
    include: {
      evidencia: {
        include: {
          afirmacion: {
            include: {
              competencia: {
                include: {
                  area: true
                }
              }
            }
          }
        }
      }
    }
  })

  console.log(pregunta?.evidencia.afirmacion.competencia.area.nombre);

  console.log('Seed se ejecutó correctamente');
}

(() => {
  main()
})();