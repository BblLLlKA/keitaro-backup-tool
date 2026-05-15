import { Router } from 'express';

import { validateDto } from '../../shared/middleware/validation.middleware.js';

import {
    CreateServerDto,
    UpdateServerDto,
    ServerIdParamDto,
    ServerQueryDto,
} from './dto/index.js';

import { ServerRepository } from './infrastructure/server.repository.js';
import { ServerService } from './application/server.service.js';
import { ServerController } from './presentation/server.controller.js';
import { TeamRepository } from '../team/infrastructure/team.repository.js';
import {
    authenticate,
    authorizeRoles,
} from '../../shared/middleware/auth.middleware.js';

const router = Router();

const repository = new ServerRepository();
const teamRepository = new TeamRepository();
const service = new ServerService(repository, teamRepository);
const controller = new ServerController(service);

router.post(
    '/',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(CreateServerDto),
    controller.create,
);

router.patch(
    '/:id',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(ServerIdParamDto, 'params'),
    validateDto(UpdateServerDto),
    controller.update,
);

router.get(
    '/',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(ServerQueryDto, 'query'),
    controller.getAll,
);

router.get(
    '/:id',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(ServerIdParamDto, 'params'),
    controller.getById,
);

router.delete(
    '/:id',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(ServerIdParamDto, 'params'),
    controller.delete,
);

export default router;
