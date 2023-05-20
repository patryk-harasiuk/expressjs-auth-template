import z from 'zod';

export const getProductSchema = {
  query: z.object({
    id: z.string(),
  }),
};
