import prisma from '../../../lib/prisma.js';

export class RoleRepository {
    async findAll() {
        return prisma.userRole.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    async findById(id) {
        return prisma.userRole.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                users: {
                    where: {
                        deletedAt: null,
                    },
                },
            },
        });
    }

    async findByName(name) {
        return prisma.userRole.findFirst({
            where: {
                name,
                deletedAt: null,
            },
        });
    }

    async create(data) {
        return prisma.userRole.create({
            data,
        });
    }

    async delete(id) {
        return prisma.userRole.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}
