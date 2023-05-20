import { Prisma } from '@prisma/client';
import { z } from 'zod';

export type UserRegisterType = {
  email: string;
  name: string;
  password: string;
};

export type UserLoginType = Omit<UserRegisterType, 'name'>;

export const userResponse = Prisma.validator<Prisma.UserArgs>()({
  select: { email: true, name: true },
});

export type UserResponseType = Prisma.UserGetPayload<typeof userResponse>;

export const registerSchema = {
  body: z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  }),
};
