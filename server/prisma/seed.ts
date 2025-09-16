import { PrismaClient, InterviewStatus } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  await prisma.interview.deleteMany();
  await prisma.user.deleteMany();

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'juan.perez@email.com',
        phone: '+52 55 1234 5678',
        firstName: 'Juan',
        lastNames: 'Pérez García',
      },
    }),
    prisma.user.create({
      data: {
        email: 'maria.rodriguez@email.com',
        phone: '+52 55 9876 5432',
        firstName: 'María',
        lastNames: 'Rodríguez López',
      },
    }),
    prisma.user.create({
      data: {
        email: 'carlos.martinez@email.com',
        phone: '+52 55 5555 1234',
        firstName: 'Carlos',
        lastNames: 'Martínez Silva',
      },
    }),
    prisma.user.create({
      data: {
        email: 'ana.gonzalez@email.com',
        phone: '+52 55 4444 9876',
        firstName: 'Ana',
        lastNames: 'González Hernández',
      },
    }),
    prisma.user.create({
      data: {
        email: 'luis.fernandez@email.com',
        phone: '+52 55 3333 4567',
        firstName: 'Luis',
        lastNames: 'Fernández Torres',
      },
    }),
  ]);

  console.log(`✅ Creados ${users.length} usuarios`);

  const interviews = await Promise.all([
    prisma.interview.create({
      data: {
        position: 'Desarrollador Frontend',
        notes:
          'Entrevista inicial de screening. Candidato con experiencia en React y Vue.js. Muy interesado en trabajar con tecnologías modernas.',
        scheduledAt: new Date('2024-01-10T10:00:00Z'),
        status: InterviewStatus.COMPLETED,
        userId: users[0].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'Desarrollador Frontend',
        notes:
          'Entrevista técnica. Evaluar conocimientos en JavaScript, React, CSS y arquitectura frontend.',
        scheduledAt: new Date('2024-01-15T14:30:00Z'),
        status: InterviewStatus.COMPLETED,
        userId: users[0].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'Desarrollador Frontend',
        notes:
          'Entrevista final con el equipo. Evaluar fit cultural y habilidades de comunicación.',
        scheduledAt: new Date('2024-01-20T11:00:00Z'),
        status: InterviewStatus.SCHEDULED,
        userId: users[0].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'Product Manager',
        notes:
          'Entrevista inicial con HR. Candidata con experiencia en gestión de productos digitales. Excelente comunicación.',
        scheduledAt: new Date('2024-01-12T09:00:00Z'),
        status: InterviewStatus.COMPLETED,
        userId: users[1].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'Product Manager',
        notes:
          'Entrevista técnica con el CPO. Evaluar experiencia en roadmap, métricas y metodologías ágiles.',
        scheduledAt: new Date('2024-01-18T11:00:00Z'),
        status: InterviewStatus.COMPLETED,
        userId: users[1].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'Product Manager',
        notes:
          'Entrevista con stakeholders. Presentación de caso de estudio y evaluación de liderazgo.',
        scheduledAt: new Date('2024-01-25T15:00:00Z'),
        status: InterviewStatus.SCHEDULED,
        userId: users[1].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'DevOps Engineer',
        notes:
          'Entrevista inicial. Candidato especializado en AWS y Docker. Evaluar conocimientos básicos en CI/CD.',
        scheduledAt: new Date('2024-01-14T10:00:00Z'),
        status: InterviewStatus.COMPLETED,
        userId: users[2].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'DevOps Engineer',
        notes:
          'Entrevista técnica práctica. Evaluar experiencia con Kubernetes, Terraform y monitoreo.',
        scheduledAt: new Date('2024-01-19T14:00:00Z'),
        status: InterviewStatus.SCHEDULED,
        userId: users[2].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'Data Scientist',
        notes:
          'Entrevista inicial. Candidata con PhD en Machine Learning. Experiencia en Python y R.',
        scheduledAt: new Date('2024-01-11T13:00:00Z'),
        status: InterviewStatus.COMPLETED,
        userId: users[3].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'Data Scientist',
        notes:
          'Entrevista técnica. Presentación de proyectos de ML y evaluación de conocimientos estadísticos.',
        scheduledAt: new Date('2024-01-16T15:30:00Z'),
        status: InterviewStatus.COMPLETED,
        userId: users[3].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'Data Scientist',
        notes:
          'Entrevista final con el equipo de datos. Evaluar colaboración y visión estratégica.',
        scheduledAt: new Date('2024-01-23T10:00:00Z'),
        status: InterviewStatus.SCHEDULED,
        userId: users[3].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'Tech Lead',
        notes:
          'Entrevista inicial. Candidato con experiencia en Node.js y microservicios. Evaluar experiencia técnica.',
        scheduledAt: new Date('2024-01-13T16:00:00Z'),
        status: InterviewStatus.COMPLETED,
        userId: users[4].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'Tech Lead',
        notes:
          'Entrevista de liderazgo técnico. Evaluar experiencia en gestión de equipos y arquitectura de sistemas.',
        scheduledAt: new Date('2024-01-20T09:30:00Z'),
        status: InterviewStatus.COMPLETED,
        userId: users[4].id,
      },
    }),
    prisma.interview.create({
      data: {
        position: 'Tech Lead',
        notes:
          'Entrevista final con CTO. Evaluar visión estratégica y capacidad de toma de decisiones técnicas.',
        scheduledAt: new Date('2024-01-27T14:00:00Z'),
        status: InterviewStatus.SCHEDULED,
        userId: users[4].id,
      },
    }),
  ]);

  console.log(`✅ Creadas ${interviews.length} entrevistas`);

  const userCount = await prisma.user.count();
  const interviewCount = await prisma.interview.count();
  const completedInterviews = await prisma.interview.count({
    where: { status: InterviewStatus.COMPLETED },
  });
  const scheduledInterviews = await prisma.interview.count({
    where: { status: InterviewStatus.SCHEDULED },
  });
  const cancelledInterviews = await prisma.interview.count({
    where: { status: InterviewStatus.CANCELLED },
  });

  console.log('\n📊 Resumen del seed:');
  console.log(`👥 Usuarios: ${userCount}`);
  console.log(`🎯 Entrevistas totales: ${interviewCount}`);
  console.log(`✅ Completadas: ${completedInterviews}`);
  console.log(`📅 Programadas: ${scheduledInterviews}`);
  console.log(`❌ Canceladas: ${cancelledInterviews}`);

  console.log('\n🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
