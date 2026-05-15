import logger from '../../lib/logger.js';
import { AppError } from '../core/errors.js';
import { Prisma } from '@prisma/client';

const isJwtError = (error) => {
    return (
        error?.name === 'JsonWebTokenError' ||
        error?.name === 'TokenExpiredError'
    );
};

export const errorMiddleware = (error, req, res, next) => {
    req.log?.error({ err: error, action: 'REQUEST_ERROR' });
    const prismaCode = error?.code;

    if (error instanceof AppError) {
        logger.warn({
            action: 'APP_ERROR',
            statusCode: error.statusCode,
            message: error.message,
            name: error.name,
            path: req.path,
            method: req.method,
        });

        return res.status(error.statusCode).json({
            message: error.message,
        });
    }

    if (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        typeof prismaCode === 'string'
    ) {
        if (prismaCode === 'P2025') {
            logger.warn({
                action: 'PRISMA_NOT_FOUND',
                code: prismaCode,
                message: error.message,
                path: req.path,
                method: req.method,
            });

            return res.status(404).json({
                message: 'Resource not found',
            });
        }

        if (prismaCode === 'P2002') {
            logger.warn({
                action: 'PRISMA_CONFLICT',
                code: prismaCode,
                message: error.message,
                path: req.path,
                method: req.method,
            });

            return res.status(409).json({
                message: 'Resource already exists',
            });
        }
    }

    if (isJwtError(error)) {
        logger.warn({
            action: 'JWT_ERROR',
            name: error.name,
            message: error.message,
            path: req.path,
            method: req.method,
        });

        return res.status(401).json({
            message: 'Invalid or expired token',
        });
    }

    logger.error({
        action: 'UNHANDLED_ERROR',
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
    });

    res.status(500).json({
        message: 'Internal server error',
    });
};
