import { z } from 'zod';

export const TeamIdParamDto = z.object({
    id: z.string().uuid(),
});
