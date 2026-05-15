import { Router } from 'express';

import { validateDto } from '../../shared/middleware/validation.middleware.js';

import { CreateTeamDto, UpdateTeamDto, TeamIdParamDto } from './dto/index.js';

import { TeamRepository } from './infrastructure/team.repository.js';
import { TeamService } from './application/team.service.js';
import { TeamController } from './presentation/team.controller.js';
import {
    authenticate,
    authorizeRoles,
} from '../../shared/middleware/auth.middleware.js';

const router = Router();

const repository = new TeamRepository();
const service = new TeamService(repository);
const controller = new TeamController(service);

router.post(
    '/',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(CreateTeamDto),
    controller.create,
);

router.patch(
    '/:id',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(TeamIdParamDto, 'params'),
    validateDto(UpdateTeamDto),
    controller.update,
);

router.get('/', authenticate, authorizeRoles('ADMIN'), controller.getAll);

router.get(
    '/:id',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(TeamIdParamDto, 'params'),
    controller.getById,
);

router.delete(
    '/:id',
    authenticate,
    authorizeRoles('ADMIN'),
    validateDto(TeamIdParamDto, 'params'),
    controller.delete,
);

export default router;
