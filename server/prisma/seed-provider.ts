import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.provider.upsert({
    where: { userId: 'cmd66872p0000v76cbl55pwzr' },
    update: {},
    create: {
      id: 'cmd6e5ayp0013v7ighj9xpcwk',
      userId: 'cmd66872p0000v76cbl55pwzr',
      // agrega otros campos requeridos si tu modelo los tiene
    },
  });
  console.log('Proveedor creado o actualizado!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });