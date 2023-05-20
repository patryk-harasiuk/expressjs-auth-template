import { User } from '@prisma/client';

export const sanitizeUser = (user: User) => {
  const { password, ...sanitizedUser } = user;

  return sanitizedUser;
};
