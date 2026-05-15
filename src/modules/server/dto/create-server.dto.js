import { z } from 'zod';

export const CreateServerDto = z.object({
    name: z.string().min(1).max(255),
    ip: z.string().regex(/^(\d{1,3}\.){3}\d{1,3}$/, 'Invalid IP address'),
    port: z.number().int().min(1).max(65535),
    username: z.string().min(1).max(255),
    password: z.string().min(1),
    teamId: z.string().uuid(),
    type: z.enum(['MAIN', 'RESERV']).default('MAIN'),
    isDumping: z.boolean().default(false),
    isActive: z.boolean().default(true),
});
