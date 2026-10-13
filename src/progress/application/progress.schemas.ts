import { z } from 'zod';

export const chapterIdParamsSchema = z.object({ chapterId: z.string().uuid() }).strict();