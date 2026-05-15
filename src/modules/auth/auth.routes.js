import { Router } from 'express';

import { validateDto } from '../../shared/middleware/validation.middleware.js';
import { authenticate } from '../../shared/middleware/auth.middleware.js';

import { LoginDto } from './dto/login.dto.js';
import { UserRepository } from '../user/infrastructure/user.repository.js';
import { RefreshTokenRepository } from './infrastructure/refresh-token.repository.js';
import { AuthService } from './application/auth.service.js';
import { AuthController } from './presentation/auth.controller.js';

const router = Router();

const userRepository = new UserRepository();
const refreshTokenRepository = new RefreshTokenRepository();
const service = new AuthService(userRepository, refreshTokenRepository);
const controller = new AuthController(service);

router.post('/login', validateDto(LoginDto), controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', authenticate, controller.logout);

export default router;
