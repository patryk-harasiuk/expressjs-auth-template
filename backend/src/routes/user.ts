import express from 'express';
import { userController } from '../controllers/index.js';
import { authenticateUser } from '../middlewares/authenticate-user.js';
import { validateRequest } from '../middlewares/validate-request.js';
import { registerSchema } from '../schemas/user.js';

const router = express.Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  userController.createUser
);

router.get('/me', authenticateUser, userController.findUser);

export default router;
