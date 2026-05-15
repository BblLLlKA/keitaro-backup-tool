import prisma from '../../../lib/prisma.js';

export class RoleRepository {
    async findAll() {
        return prisma.userRole.findMany({
            orderBy: {
                createdAt: 'asc',
            },
        });
    }

    async findById(id) {
        return prisma.userRole.findUnique({
            where: {
                id,
            },
            include: {
                users: true,
            },
        });
    }

    async findByName(name) {
        return prisma.userRole.findUnique({
            where: {
                name,
            },
        });
    }

    async create(data) {
        return prisma.userRole.create({
            data,
        });
    }

    async delete(id) {
        return prisma.userRole.delete({
            where: {
                id,
            },
        });
    }
}
