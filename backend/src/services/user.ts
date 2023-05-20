/* eslint-disable no-useless-catch */
import { users } from '../data_access/user.js';
import { ApiError } from '../errors/api-error.js';
import { UserRegisterType } from '../schemas/user.js';

import { createHash } from '../utils/password.js';

export const registerUser = async (userData: UserRegisterType) => {
  const { email, name, password } = userData;

  const hashedPassword = await createHash(password);

  const createdUser = await users.register({
    email,
    name,
    password: hashedPassword,
  });

  return createdUser;
};

export const getUser = async (userId: string) => {
  const foundUser = await users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!foundUser) throw new ApiError(`User with ${userId} id does not exist`);

  return foundUser;
};
