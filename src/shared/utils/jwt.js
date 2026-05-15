import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

const requireEnv = (name) => {
    const value = process.env[name];

    if (!value) {
        throw new Error(`${name} is not set`);
    }

    return value;
};

export const generateAccessToken = (user) => {
    const accessSecret = requireEnv('JWT_ACCESS_SECRET');

    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: user.role?.name,
        },

        accessSecret,

        {
            expiresIn: '15m',
        },
    );
};

export const generateRefreshToken = (user) => {
    const refreshSecret = requireEnv('JWT_REFRESH_SECRET');

    return jwt.sign(
        {
            sub: user.id,
            jti: randomUUID(),
        },

        refreshSecret,

        {
            expiresIn: '30d',
        },
    );
};
