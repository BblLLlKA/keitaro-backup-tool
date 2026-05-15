import argon2 from 'argon2';

import { BaseService } from '../../../shared/core/BaseService.js';
import { ConflictError, NotFoundError } from '../../../shared/core/errors.js';

import { UserResponseDto } from '../dto/index.js';
import logger from '../../../lib/logger.js';

export class UserService extends BaseService {
    constructor(repository, roleRepository) {
        super(repository);
        this.roleRepository = roleRepository;
    }

    async ensureRoleExists(roleId) {
        const role = await this.roleRepository.findById(roleId);

        if (!role) {
            throw new NotFoundError('Role not found');
        }

        return role;
    }

    async create(data) {
        logger.info({ action: 'CREATE_USER_START', email: data.email });
        const existingUser = await this.repository.findByEmail(data.email);

        if (existingUser) {
            throw new ConflictError('User already exists');
        }

        const hashedPassword = await argon2.hash(data.password);
        await this.ensureRoleExists(data.roleId);

        const user = await this.repository.create({
            email: data.email,
            password: hashedPassword,
            roleId: data.roleId,
        });

        if (!user) {
            logger.error({ action: 'CREATE_USER_FAILED', email: data.email });
            throw new Error('Failed to create user');
        }

        logger.info({
            action: 'CREATE_USER_SUCCESS',
            userId: user.id,
            email: user.email,
        });

        return new UserResponseDto(user);
    }

    async getAll(query) {
        logger.info({ action: 'GET_USERS_START', query });
        const result = await this.repository.findAll(query);

        result.items = result.items.map((user) => new UserResponseDto(user));

        if (result.items.length === 0) {
            logger.warn({ action: 'GET_USERS_EMPTY', query });
        }

        logger.info({
            action: 'GET_USERS_SUCCESS',
            count: result.items.length,
        });

        return result;
    }

    async getById(id) {
        logger.info({ action: 'GET_USER_BY_ID_START', userId: id });
        const user = await this.repository.findById(id);

        if (!user) {
            logger.warn({ action: 'GET_USER_BY_ID_NOT_FOUND', userId: id });
            throw new NotFoundError('User not found');
        }

        logger.info({ action: 'GET_USER_BY_ID_SUCCESS', userId: id });
        return new UserResponseDto(user);
    }

    async update(id, data) {
        logger.info({ action: 'UPDATE_USER_START', userId: id });
        const updateData = { ...data };

        if (updateData.password) {
            updateData.password = await argon2.hash(updateData.password);
        }

        if (updateData.roleId) {
            await this.ensureRoleExists(updateData.roleId);
        }

        const user = await this.repository.update(id, updateData);

        if (!user) {
            logger.warn({ action: 'UPDATE_USER_NOT_FOUND', userId: id });
            throw new NotFoundError('User not found');
        }

        logger.info({ action: 'UPDATE_USER_SUCCESS', userId: id });
        return new UserResponseDto(user);
    }
}
