import type { PrismaClient } from '@prisma/client';
import { isNotFoundError } from '../errors/is-not-found-error.js';

import prisma from '../utils/client.js';

const RefreshTokens = (prismaRefreshToken: PrismaClient['refreshToken']) => {
  return Object.assign(prismaRefreshToken, {
    async deleteByJTI(jti: string): Promise<void> {
      try {
        const statement = prismaRefreshToken.delete({
          where: {
            jti,
          },
        });

        await statement;
      } catch (error) {
        if (isNotFoundError(error))
          throw new Error(`Object with jti ${jti} does not exist`);
      }
    },

    async createRefreshToken(userId: string, jti: string): Promise<void> {
      const statement = prismaRefreshToken.create({
        data: {
          userId,
          jti,
        },
      });

      await statement;
    },
  });
};

export const refreshTokens = RefreshTokens(prisma.refreshToken);
