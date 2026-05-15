import prisma from '../../../lib/prisma.js';
import { BaseRepository } from '../../../shared/core/BaseRepository.js';

export class ServerRepository extends BaseRepository {
    constructor() {
        super(prisma.server);
    }

    async findByTeamId(teamId) {
        return this.model.findMany({
            where: {
                teamId,
                deletedAt: null,
                team: {
                    deletedAt: null,
                },
            },
        });
    }

    async create(data, include = {}) {
        return this.model.create({
            data,
            include,
        });
    }

    async update(id, data, include = {}) {
        return this.model.update({
            where: {
                id,
            },
            data,
            include,
        });
    }

    async delete(id, include = {}) {
        return this.model.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
            include,
        });
    }

    async findAll({
        page = 1,
        limit = 20,
        where = {},
        orderBy = { createdAt: 'desc' },
        include = {},
    } = {}) {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const safePage =
            Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
        const safeLimit =
            Number.isInteger(limitNumber) && limitNumber > 0 ? limitNumber : 20;
        const skip = (safePage - 1) * safeLimit;

        const whereWithFilter = {
            ...where,
            deletedAt: null,
            team: {
                ...(where?.team ?? {}),
                deletedAt: null,
            },
        };

        const [items, total] = await Promise.all([
            this.model.findMany({
                skip,
                take: safeLimit,
                where: whereWithFilter,
                orderBy,
                include,
            }),

            this.model.count({
                where: whereWithFilter,
            }),
        ]);

        return {
            items,
            total,
            page: safePage,
            limit: safeLimit,
            totalPages: Math.ceil(total / safeLimit),
        };
    }

    async findById(id, include = {}) {
        return this.model.findFirst({
            where: {
                id,
                deletedAt: null,
                team: {
                    deletedAt: null,
                },
            },
            include,
        });
    }
}
