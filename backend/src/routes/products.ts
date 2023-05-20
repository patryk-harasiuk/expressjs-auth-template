import express from 'express';
import { productsController } from '../controllers/index.js';
import { validateRequest } from '../middlewares/validate-request.js';
import { getProductSchema } from '../schemas/product.js';

const router = express.Router();

router.get('/products', productsController.getProducts);

router.get(
  '/product/:id',
  validateRequest(getProductSchema),
  productsController.getProduct
);

export default router;
