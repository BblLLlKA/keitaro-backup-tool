import pinoHttp from 'pino-http';
import { randomUUID } from 'crypto';

import logger from '../../lib/logger.js';

export const httpLogger = pinoHttp({
    logger,
    wrapSerializers: false,
    genReqId: (req, res) => {
        const headerRequestId = req.headers['x-request-id'];
        const requestId =
            typeof headerRequestId === 'string' && headerRequestId.trim()
                ? headerRequestId.trim()
                : randomUUID();

        res.setHeader('x-request-id', requestId);

        return requestId;
    },
    customLogLevel: (req, res, err) => {
        if (err || res.statusCode >= 500) {
            return 'error';
        }

        if (res.statusCode >= 400) {
            return 'warn';
        }

        return 'info';
    },
    customReceivedMessage: (req) => `request started: ${req.method} ${req.url}`,
    customSuccessMessage: (req, res) =>
        `request completed: ${req.method} ${req.url} ${res.statusCode}`,
    customErrorMessage: (req, res, err) =>
        `request failed: ${req.method} ${req.url} ${res.statusCode} ${err.message}`,
    serializers: {
        req: (req) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            remoteAddress: req.socket?.remoteAddress,
            remotePort: req.socket?.remotePort,
            userAgent: req.headers['user-agent'],
        }),
        res: (res) => ({
            statusCode: res.statusCode,
        }),
    },
});
