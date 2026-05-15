import { Router } from 'express';

import { RoleRepository } from './infrastructure/role.repository.js';
import { RoleService } from './application/role.service.js';
import { RoleController } from './presentation/role.controller.js';
import {
    authenticate,
    authorizeRoles,
} from '../../shared/middleware/auth.middleware.js';

const router = Router();

const repository = new RoleRepository();
const service = new RoleService(repository);
const controller = new RoleController(service);

router.get('/', authenticate, authorizeRoles('ADMIN'), controller.getAll);
router.get('/:id', authenticate, authorizeRoles('ADMIN'), controller.getById);

export default router;
