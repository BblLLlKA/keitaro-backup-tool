import { z } from 'zod';

export const CreateTeamDto = z.object({
    name: z.string().min(1).max(255),
});
