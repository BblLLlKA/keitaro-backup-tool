import { z } from 'zod';

export const ServerIdParamDto = z.object({
    id: z.string().uuid(),
});
