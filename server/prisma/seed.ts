import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Crea un usuario proveedor
  const user = await prisma.user.create({
    data: {
      email: 'proveedor@test.com',
      password: '123456',
      name: 'Proveedor Demo',
      role: 'PROVIDER'
    }
  });

  // Crea el perfil de proveedor
  const provider = await prisma.provider.create({
    data: {
      userId: user.id,
      companyName: 'Empresa Demo',
      nit: '123456789-0'
    }
  });

  // Crea un servicio
  await prisma.service.create({
    data: {
      providerId: provider.id,
      name: 'Servicio de Prueba',
      description: 'Descripción de prueba',
      price: 100000,
      duration: 60,
      category: 'Tecnología'
    }
  });
}

main().finally(() => prisma.$disconnect());