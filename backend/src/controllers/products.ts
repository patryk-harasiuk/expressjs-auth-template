import { Request, Response } from 'express';
import { productsService } from '../services/index.js';
import { ApiError } from '../errors/api-error.js';
import { HTTPCode } from '../types/http.js';
import { TypedRequestQuery } from '../middlewares/validate-request.js';
import { getProductSchema } from '../schemas/product.js';

export const getProducts = async (_: Request, res: Response) => {
  try {
    const foundProducts = await productsService.findProducts();

    res.status(HTTPCode.OK).send(foundProducts);
  } catch (error) {
    if (error instanceof ApiError)
      return res.status(HTTPCode.BAD_REQUEST).send({ message: error.message });

    return res
      .status(HTTPCode.BAD_REQUEST)
      .send({ message: 'Could not find products' });
  }
};

export const getProduct = async (
  req: TypedRequestQuery<(typeof getProductSchema)['query']>,
  res: Response
) => {
  try {
    const {
      query: { id },
    } = req;

    const foundProduct = await productsService.findProduct(id);

    res.status(HTTPCode.OK).send(foundProduct);
  } catch (error) {
    if (error instanceof ApiError)
      return res
        .status(error.code ?? HTTPCode.BAD_REQUEST)
        .send({ message: error.message });

    return res
      .status(HTTPCode.BAD_REQUEST)
      .send({ message: 'Could not find product' });
  }
};
