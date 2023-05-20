import { products } from '../data_access/products.js';
import { ApiError } from '../errors/api-error.js';

export const findProducts = async () => await products.findProducts();

export const findProduct = async (id: string) => {
  const product = await products.findUnique({
    where: {
      id,
    },
  });

  if (!product)
    throw new ApiError(`Could not find product with id: ${id}`, 400);

  return product;
};
