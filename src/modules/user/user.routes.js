import { Router } from 'express';

import { validateDto } from '../../shared/middleware/validation.middleware.js';

import {
    CreateUserDto,
    UpdateUserDto,
    UserQueryDto,
    UserIdParamDto,
} from './dto/index.js';

import { UserRepository } from './infrastructure/user.repository.js';
import { UserService } from './application/user.service.js';
import { UserController } from './presentation/user.controller.js';
import { RoleRepository } from '../role/infrastructure/role.repository.js';
import {
    authenticate,
    authorizeRoles,
} from '../../shared/middleware/auth.middleware.js';

const router = Router();

const repository = new UserRepository();
const roleRepository = new RoleRepository();
const service = new UserService(repository, roleRepository);
const controller = new UserController(service);

router.post(
    '/',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(CreateUserDto),
    controller.create,
);

router.patch(
    '/:id',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(UserIdParamDto, 'params'),
    validateDto(UpdateUserDto),
    controller.update,
);

router.get(
    '/',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(UserQueryDto, 'query'),
    controller.getAll,
);
router.get(
    '/:id',
    authenticate,
    validateDto(UserIdParamDto, 'params'),
    controller.getById,
);
router.delete(
    '/:id',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(UserIdParamDto, 'params'),
    controller.delete,
);

export default router;
