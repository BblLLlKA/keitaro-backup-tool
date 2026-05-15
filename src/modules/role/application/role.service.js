import logger from '../../../lib/logger.js';
import { RoleResponseDto } from '../dto/role-response.dto.js';

export class RoleService {
    constructor(roleRepository) {
        this.roleRepository = roleRepository;
    }

    async getAll() {
        logger.info({ action: 'GET_ALL_ROLES' });

        const roles = await this.roleRepository.findAll();

        return roles.map((role) => new RoleResponseDto(role));
    }

    async getById(id) {
        logger.info({ action: 'GET_ROLE_BY_ID', id });

        const role = await this.roleRepository.findById(id);

        return new RoleResponseDto(role);
    }
}
