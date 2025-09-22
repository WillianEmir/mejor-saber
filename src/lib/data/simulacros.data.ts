import 'server-only';


import prisma from "../prisma";

export const getSimulacrosHistory = async (userId: string) => {
  const simulacros = await prisma.simulacro.findMany({
    where: {
      userId,
    },
    include: {
      competencia: {
        include: {
          area: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return simulacros;
};

export const getSimulacroResult = async (simulacroId: string) => {
  const simulacroPreguntas = await prisma.simulacroPregunta.findMany({
    where: {
      simulacroId,
    },
    include: {
      pregunta: {
        include: {
          opciones: true,
        },
      },
      opcionSeleccionada: true,
    },
  });

  return simulacroPreguntas;
};
