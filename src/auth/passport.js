import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import prisma from '../lib/prisma.js';

const accessSecret = process.env.JWT_ACCESS_SECRET;

if (!accessSecret) {
    throw new Error('JWT_ACCESS_SECRET is not set');
}

passport.use(
    new Strategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: accessSecret,
        },

        async (payload, done) => {
            try {
                const user = await prisma.user.findUnique({
                    where: {
                        id: payload.sub,
                    },
                    include: {
                        role: true,
                    },
                });

                if (!user) {
                    return done(null, false);
                }

                if (!user.isActive) {
                    return done(null, false);
                }

                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        },
    ),
);

export default passport;
