import { z } from 'zod';

export const UpdateTeamDto = z.object({
    name: z.string().min(1).max(255).optional(),
});
