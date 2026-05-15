import prisma from '../../../lib/prisma.js';

export class RefreshTokenRepository {
    async create(data) {
        return prisma.refreshToken.create({ data });
    }

    async findByToken(token) {
        return prisma.refreshToken.findUnique({ where: { token } });
    }

    async revoke(token) {
        return prisma.refreshToken.update({
            where: { token },
            data: { revokedAt: new Date() },
        });
    }

    async revokeAllForUser(userId) {
        return prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
}
