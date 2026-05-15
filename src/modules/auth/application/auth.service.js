import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

import logger from '../../../lib/logger.js';
import { UnauthorizedError } from '../../../shared/core/errors.js';
import {
    generateAccessToken,
    generateRefreshToken,
} from '../../../shared/utils/jwt.js';

const getTokenExpiryDate = (token) => {
    const decoded = jwt.decode(token);
    const exp = decoded?.exp;

    if (typeof exp !== 'number') {
        throw new Error('Token payload does not contain exp');
    }

    return new Date(exp * 1000);
};

const getRefreshSecret = () => {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not set');
    }

    return secret;
};

export class AuthService {
    constructor(userRepository, refreshTokenRepository) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    async login(email, password) {
        logger.info({ action: 'LOGIN_START', email });

        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            logger.warn({ action: 'LOGIN_FAILED_NOT_FOUND', email });
            throw new UnauthorizedError('Invalid credentials');
        }

        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            logger.warn({ action: 'LOGIN_FAILED_WRONG_PASSWORD', email });
            throw new UnauthorizedError('Invalid credentials');
        }

        if (!user.isActive) {
            logger.warn({
                action: 'LOGIN_FAILED_USER_INACTIVE',
                userId: user.id,
            });
            throw new UnauthorizedError('User account is inactive');
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const expiresAt = getTokenExpiryDate(refreshToken);

        await this.refreshTokenRepository.create({
            token: refreshToken,
            userId: user.id,
            expiresAt,
        });

        logger.info({ action: 'LOGIN_SUCCESS', userId: user.id });

        return { accessToken, refreshToken };
    }

    async refresh(token) {
        logger.info({ action: 'REFRESH_START' });

        const stored = await this.refreshTokenRepository.findByToken(token);

        if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
            logger.warn({ action: 'REFRESH_FAILED_INVALID_TOKEN' });
            throw new UnauthorizedError('Invalid or expired refresh token');
        }

        let payload;
        try {
            payload = jwt.verify(token, getRefreshSecret());
        } catch {
            logger.warn({ action: 'REFRESH_FAILED_JWT_VERIFY' });
            throw new UnauthorizedError('Invalid or expired refresh token');
        }

        const user = await this.userRepository.findById(payload.sub);

        if (!user) {
            logger.warn({
                action: 'REFRESH_FAILED_USER_NOT_FOUND',
                userId: payload.sub,
            });
            throw new UnauthorizedError('Invalid or expired refresh token');
        }

        if (!user.isActive) {
            logger.warn({
                action: 'REFRESH_FAILED_USER_INACTIVE',
                userId: user.id,
            });
            throw new UnauthorizedError('User account is inactive');
        }

        await this.refreshTokenRepository.revoke(token);

        const accessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        const expiresAt = getTokenExpiryDate(newRefreshToken);

        await this.refreshTokenRepository.create({
            token: newRefreshToken,
            userId: user.id,
            expiresAt,
        });

        logger.info({ action: 'REFRESH_SUCCESS', userId: user.id });

        return { accessToken, refreshToken: newRefreshToken };
    }

    async logout(userId) {
        logger.info({ action: 'LOGOUT_START', userId });

        await this.refreshTokenRepository.revokeAllForUser(userId);

        logger.info({ action: 'LOGOUT_SUCCESS', userId });
    }
}
