import { z } from 'zod';

export const loginSchema = {
  body: z.object({
    email: z.string(),
    password: z.string(),
  }),
};

export const tokensSchema = z.object({
  access: z.string(),
  refresh: z.string(),
});

export const refreshTokenSchema = z.object({
  access: z.string().optional(),
  refresh: z.string(),
});
