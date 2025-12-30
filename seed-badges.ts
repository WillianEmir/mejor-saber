import { PrismaClient } from './src/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding initial badges...');

  const badgesToCreate = [
    {
      name: 'Primer Simulacro',
      description: 'Completa tu primer simulacro de las Pruebas Saber 11.',
      iconUrl: '/images/badges/first-simulacro.png', // Placeholder icon URL
      criteria: 'Completar 1 simulacro.',
    },
    {
      name: 'Estudiante Constante',
      description: 'Inicia sesión en la aplicación por 7 días consecutivos.',
      iconUrl: '/images/badges/constant-student.png', // Placeholder icon URL
      criteria: 'Iniciar sesión 7 días consecutivos.',
    },
    {
      name: 'Maestro de Matemáticas',
      description: 'Obtén un puntaje mayor al 85% en todos los simulacros del área de Matemáticas.',
      iconUrl: '/images/badges/math-master.png', // Placeholder icon URL
      criteria: 'Puntaje > 85% en simulacros de Matemáticas.',
    },
    {
      name: 'Activación Premium',
      description: 'Has activado una suscripción premium, ¡acceso total desbloqueado!',
      iconUrl: '/images/badges/premium-activation.png', // Placeholder icon URL
      criteria: 'Activar una suscripción de pago.',
    },
  ];

  for (const badgeData of badgesToCreate) {
    await prisma.badge.upsert({
      where: { name: badgeData.name },
      update: {},
      create: badgeData,
    });
    console.log(`Upserted badge: ${badgeData.name}`);
  }

  console.log('Initial badges seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });