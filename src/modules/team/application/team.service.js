import logger from '../../../lib/logger.js';
import { BaseService } from '../../../shared/core/BaseService.js';
import { NotFoundError } from '../../../shared/core/errors.js';
import { TeamResponseDto } from '../dto/index.js';

export class TeamService extends BaseService {
    constructor(repository) {
        super(repository);
    }

    async create(data) {
        logger.info({ action: 'CREATE_TEAM_START', name: data.name });

        const team = await this.repository.create(data);

        if (!team) {
            logger.error({ action: 'CREATE_TEAM_FAILED', name: data.name });
            throw new Error('Failed to create team');
        }

        logger.info({
            action: 'CREATE_TEAM_SUCCESS',
            teamId: team.id,
            name: team.name,
        });

        return new TeamResponseDto(team);
    }

    async getAll(query) {
        logger.info({ action: 'GET_ALL_TEAMS' });
        const result = await this.repository.findAll(query);

        return {
            ...result,
            items: result.items.map((team) => new TeamResponseDto(team)),
        };
    }

    async getById(id) {
        logger.info({ action: 'GET_TEAM_BY_ID', id });
        const team = await this.repository.findById(id);

        if (!team) {
            throw new NotFoundError('Team not found');
        }

        return new TeamResponseDto(team);
    }

    async update(id, data) {
        logger.info({ action: 'UPDATE_TEAM_START', id });

        const team = await this.repository.update(id, data);

        logger.info({
            action: 'UPDATE_TEAM_SUCCESS',
            teamId: id,
        });

        return new TeamResponseDto(team);
    }

    async delete(id) {
        logger.info({ action: 'DELETE_TEAM_START', id });

        const team = await this.repository.delete(id);

        logger.info({
            action: 'DELETE_TEAM_SUCCESS',
            teamId: id,
        });

        return new TeamResponseDto(team);
    }
}
