import logger from '../../../lib/logger.js';
import { BaseService } from '../../../shared/core/BaseService.js';
import { NotFoundError } from '../../../shared/core/errors.js';
import {
    encryptPassword,
    decryptPassword,
} from '../../../shared/utils/encryption.js';

import { ServerResponseDto } from '../dto/index.js';

const SERVER_RELATIONS = {
    team: true,
};

export class ServerService extends BaseService {
    constructor(repository, teamRepository) {
        super(repository);
        this.teamRepository = teamRepository;
    }

    async ensureTeamExists(teamId) {
        const team = await this.teamRepository.findById(teamId);

        if (!team) {
            throw new NotFoundError('Team not found');
        }

        return team;
    }

    async create(data) {
        logger.info({ action: 'CREATE_SERVER_START', name: data.name });

        await this.ensureTeamExists(data.teamId);

        const encryptedData = {
            ...data,
            password: encryptPassword(data.password),
        };

        const server = await this.repository.create(
            encryptedData,
            SERVER_RELATIONS,
        );

        if (!server) {
            logger.error({ action: 'CREATE_SERVER_FAILED', name: data.name });
            throw new Error('Failed to create server');
        }

        logger.info({
            action: 'CREATE_SERVER_SUCCESS',
            serverId: server.id,
            name: server.name,
        });

        return new ServerResponseDto({
            ...server,
            password: decryptPassword(server.password),
        });
    }

    async getAll(query) {
        logger.info({ action: 'GET_ALL_SERVERS' });
        const result = await this.repository.findAll({
            ...(query ?? {}),
            include: {
                ...((query ?? {}).include ?? {}),
                ...SERVER_RELATIONS,
            },
        });

        return {
            ...result,
            items: result.items.map(
                (server) =>
                    new ServerResponseDto({
                        ...server,
                        password: decryptPassword(server.password),
                    }),
            ),
        };
    }

    async getById(id) {
        logger.info({ action: 'GET_SERVER_BY_ID', id });
        const server = await this.repository.findById(id, SERVER_RELATIONS);

        if (!server) {
            throw new NotFoundError('Server not found');
        }

        return new ServerResponseDto({
            ...server,
            password: decryptPassword(server.password),
        });
    }

    async update(id, data) {
        logger.info({ action: 'UPDATE_SERVER_START', id });

        if (data.teamId) {
            await this.ensureTeamExists(data.teamId);
        }

        const encryptedData = {
            ...data,
            ...(data.password && { password: encryptPassword(data.password) }),
        };

        const server = await this.repository.update(
            id,
            encryptedData,
            SERVER_RELATIONS,
        );

        logger.info({
            action: 'UPDATE_SERVER_SUCCESS',
            serverId: id,
        });

        return new ServerResponseDto({
            ...server,
            password: decryptPassword(server.password),
        });
    }

    async delete(id) {
        logger.info({ action: 'DELETE_SERVER_START', id });

        const server = await this.repository.delete(id, SERVER_RELATIONS);

        logger.info({
            action: 'DELETE_SERVER_SUCCESS',
            serverId: id,
        });

        return new ServerResponseDto({
            ...server,
            password: decryptPassword(server.password),
        });
    }
}
