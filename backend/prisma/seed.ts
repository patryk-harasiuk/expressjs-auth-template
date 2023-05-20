import process from 'node:process';
import Prisma from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const products: Prisma.Product[] = [
  {
    id: '1',
    description: '',
    name: 'White Tee',
    price: new Prisma.Prisma.Decimal(500),
    image: '/white-tee.jpg',
  },

  {
    id: '2',
    description: '',
    name: 'Black Tee',
    price: new Prisma.Prisma.Decimal(1500),
    image: '/black-tee.jpg',
  },

  {
    id: '3',
    description: '',
    name: 'White Hoodie',
    price: new Prisma.Prisma.Decimal(2500),
    image: '/white-hoodie.jpg',
  },

  {
    id: '4',
    description: '',
    name: 'Blue Tee',
    price: new Prisma.Prisma.Decimal(900),
    image: '/blue-tee.jpg',
  },

  {
    id: '5',
    description: '',
    name: 'Black Hoodie',
    price: new Prisma.Prisma.Decimal(1000),
    image: '/black-hoodie.jpg',
  },

  {
    id: '6',
    description: '',
    name: 'Blue Tee',
    price: new Prisma.Prisma.Decimal(500),
    image: '/blue-tee.jpg',
  },

  {
    id: '7',
    description: '',
    name: 'Red Tee',
    price: new Prisma.Prisma.Decimal(500),
    image: '/red-tee.jpg',
  },
];

async function main() {
  await prisma.product.createMany({
    data: products,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
