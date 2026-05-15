export class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    async findAll({
        page = 1,
        limit = 20,
        where = {},
        orderBy = {
            createdAt: 'desc',
        },
        include = {},
    } = {}) {
        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const safePage =
            Number.isInteger(pageNumber) && pageNumber > 0 ? pageNumber : 1;
        const safeLimit =
            Number.isInteger(limitNumber) && limitNumber > 0 ? limitNumber : 20;
        const skip = (safePage - 1) * safeLimit;

        const [items, total] = await Promise.all([
            this.model.findMany({
                skip,
                take: safeLimit,
                where,
                orderBy,
                include,
            }),

            this.model.count({
                where,
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
        return this.model.findUnique({
            where: {
                id,
            },
            include,
        });
    }

    async findOne(where = {}, include = {}) {
        return this.model.findFirst({
            where,
            include,
        });
    }

    async create(data) {
        return this.model.create({
            data,
        });
    }

    async update(id, data) {
        return this.model.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id) {
        return this.model.delete({
            where: {
                id,
            },
        });
    }
}
