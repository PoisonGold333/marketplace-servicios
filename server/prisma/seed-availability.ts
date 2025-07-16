import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const providerId = 'cmd6e5ayp0013v7ighj9xpcwk';

  const daysOfWeek = [1, 2, 3, 4, 5]; // Lunes a Viernes

  for (const day of daysOfWeek) {
    // Borra si ya existe para evitar duplicados
    await prisma.availability.deleteMany({
      where: { providerId, dayOfWeek: day },
    });

    await prisma.availability.create({
      data: {
        providerId,
        dayOfWeek: day,
        startTime: '09:00',
        endTime: '12:00',
      },
    });
  }

  console.log('Disponibilidad creada!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });