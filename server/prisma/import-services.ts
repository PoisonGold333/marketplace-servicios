import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

async function main() {
  const records: any[] = [];
  fs.createReadStream('prisma/services.csv')
    .pipe(parse({ columns: true, delimiter: ',' }))
    .on('data', (row) => records.push(row))
    .on('end', async () => {
      for (const service of records) {
        await prisma.service.create({
          data: {
            name: service.name,
            description: service.description,
            price: Number(service.price),
            duration: Number(service.duration),
            category: service.category,
            providerId: service.providerId,
          },
        });
      }
      console.log('Servicios importados!');
      await prisma.$disconnect();
    });
}

main();