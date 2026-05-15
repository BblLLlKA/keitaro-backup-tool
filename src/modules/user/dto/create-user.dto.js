import { z } from 'zod';

export const CreateUserDto = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(128),
    roleId: z.string().uuid(),
});
