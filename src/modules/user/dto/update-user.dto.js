import { z } from 'zod';

export const UpdateUserDto = z.object({
    email: z.string().email().optional(),
    password: z.string().min(8).max(128).optional(),
    isActive: z.boolean().optional(),
    roleId: z.string().uuid().optional(),
});
