import { z } from 'zod';

export const ServerQueryDto = z.object({
    page: z.string().regex(/^\d+$/).optional(),
    limit: z.string().regex(/^\d+$/).optional(),
    teamId: z.string().uuid().optional(),
});
