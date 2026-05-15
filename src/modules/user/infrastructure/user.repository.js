import prisma from '../../../lib/prisma.js';
import { BaseRepository } from '../../../shared/core/BaseRepository.js';

export class UserRepository extends BaseRepository {
    constructor() {
        super(prisma.user);
    }

    async findByEmail(email) {
        return this.model.findUnique({
            where: {
                email,
            },
            include: {
                role: true,
            },
        });
    }

    async findById(id) {
        return this.model.findUnique({
            where: {
                id,
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
}
