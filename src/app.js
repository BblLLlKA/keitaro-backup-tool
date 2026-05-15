import express from 'express';
import cookieParser from 'cookie-parser';
import passport from './auth/passport.js';

import userRoutes from './modules/user/user.routes.js';
import authRoutes from './modules/auth/auth.routes.js';
import roleRoutes from './modules/role/role.routes.js';
import teamRoutes from './modules/team/team.routes.js';
import serverRoutes from './modules/server/server.routes.js';
import { httpLogger } from './shared/middleware/logger.middleware.js';
import { errorMiddleware } from './shared/middleware/error.middleware.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(httpLogger);
app.use(passport.initialize());

const apiPrefix = '/api/v1';

app.use(`${apiPrefix}/users`, userRoutes);
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/roles`, roleRoutes);
app.use(`${apiPrefix}/teams`, teamRoutes);
app.use(`${apiPrefix}/servers`, serverRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
    });
});

app.use(errorMiddleware);

export default app;
