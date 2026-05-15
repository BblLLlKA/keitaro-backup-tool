import passport from '../../auth/passport.js';
import { ForbiddenError, UnauthorizedError } from '../core/errors.js';

export const authenticate = (req, res, next) => {
    try {
        passport.authenticate('jwt', { session: false }, (err, user) => {
            if (err) {
                return next(new UnauthorizedError('Invalid or expired token'));
            }

            if (!user) {
                return next(new UnauthorizedError('Unauthorized'));
            }

            req.user = user;
            next();
        })(req, res, next);
    } catch {
        return next(new UnauthorizedError('Invalid or expired token'));
    }
};

export const authorizeRoles = (...allowedRoles) => {
    const roles = new Set(allowedRoles);

    return (req, res, next) => {
        const roleName = req.user?.role?.name;

        if (!roleName || !roles.has(roleName)) {
            return next(new ForbiddenError('Insufficient permissions'));
        }

        next();
    };
};
