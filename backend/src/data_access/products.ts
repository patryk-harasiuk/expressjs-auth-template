import { PrismaClient, Product } from '@prisma/client';
import prisma from '../utils/client.js';

const Products = (prismaProduct: PrismaClient['product']) => {
  // #TODO: Add some pagination maybe
  return Object.assign(prismaProduct, {
    async findProducts(): Promise<Product[]> {
      return prismaProduct.findMany();
    },
  });
};

export const products = Products(prisma.product);
