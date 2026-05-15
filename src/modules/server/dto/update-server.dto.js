import { z } from 'zod';

export const UpdateServerDto = z.object({
    name: z.string().min(1).max(255).optional(),
    ip: z
        .string()
        .regex(/^(\d{1,3}\.){3}\d{1,3}$/, 'Invalid IP address')
        .optional(),
    port: z.number().int().min(1).max(65535).optional(),
    username: z.string().min(1).max(255).optional(),
    password: z.string().min(1).optional(),
    type: z.enum(['MAIN', 'RESERV']).optional(),
    isDumping: z.boolean().optional(),
    isActive: z.boolean().optional(),
});
