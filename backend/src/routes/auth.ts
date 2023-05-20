import express from 'express';

import { authController } from '../controllers/index.js';
import { validateRefreshToken } from '../middlewares/validate-refresh-token.js';
import { validateRequest } from '../middlewares/validate-request.js';
import { loginSchema } from '../schemas/auth.js';

const router = express.Router();

router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', validateRefreshToken, authController.refresh);

export default router;
