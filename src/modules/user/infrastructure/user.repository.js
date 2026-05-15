import prisma from '../../../lib/prisma.js';
import { BaseRepository } from '../../../shared/core/BaseRepository.js';

export class UserRepository extends BaseRepository {
    constructor() {
        super(prisma.user);
    }

    async findByEmail(email) {
        return this.model.findFirst({
            where: {
                email,
                deletedAt: null,
            },
            include: {
                role: true,
            },
        });
    }

    async findById(id) {
        return this.model.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                role: true,
            },
        });
    }

    async findAll(query = {}) {
        return super.findAll({
            ...query,
            include: {
                ...((query ?? {}).include ?? {}),
                role: true,
            },
        });
    }

    async create(data) {
        return this.model.create({
            data,
            include: {
                role: true,
            },
        });
    }

    async update(id, data) {
        return this.model.update({
            where: {
                id,
            },
            data,
            include: {
                role: true,
            },
        });
    }

    async delete(id) {
        return this.model.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
            include: {
                role: true,
            },
        });
    }
}
