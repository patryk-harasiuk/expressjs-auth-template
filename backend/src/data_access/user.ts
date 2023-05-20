import type { PrismaClient, User } from '@prisma/client';
import {
  UserRegisterType,
  userResponse,
  UserResponseType,
} from '../schemas/user.js';

import prisma from '../utils/client.js';

const Users = (prismaUser: PrismaClient['user']) => {
  return Object.assign(prismaUser, {
    async register(data: UserRegisterType): Promise<UserResponseType> {
      return prismaUser.create({ data, select: userResponse['select'] });
    },

    async findByEmail(email: string): Promise<User> {
      const user = await prismaUser.findFirst({
        where: {
          email,
        },
      });

      if (!user) throw new Error(`User with email ${email} does not exist`);

      return user;
    },
  });
};

export const users = Users(prisma.user);
