import pino from 'pino';

const isPretty = process.env.LOG_PRETTY === 'true';

const options = {
    level: process.env.LOG_LEVEL || 'info',
    base: {
        service: 'keitaro-backup-tool',
        env: process.env.NODE_ENV || 'development',
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
        paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.headers["set-cookie"]',
            'headers.authorization',
            'headers.cookie',
            'headers["set-cookie"]',
            '*.password',
            '*.refreshToken',
            '*.accessToken',
            '*.token',
        ],
        censor: '[REDACTED]',
    },
};

if (isPretty) {
    options.transport = {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            singleLine: true,
            ignore: 'pid,hostname',
        },
    };
}

const logger = pino(options);

export default logger;
