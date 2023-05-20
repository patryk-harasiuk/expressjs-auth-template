import { Request, Response } from 'express';
import { TypedRequestBody } from '../middlewares/validate-request.js';
import { registerSchema } from '../schemas/user.js';
import { userService } from '../services/index.js';
import { HTTPCode } from '../types/http.js';
import { isUniqueViolationError } from '../errors/is-unique-violation-error.js';
import { getUserIdFromToken } from '../utils/jwt.js';
import { ApiError } from '../errors/api-error.js';
import { sanitizeUser } from '../utils/user.js';

export const createUser = async (
  req: TypedRequestBody<(typeof registerSchema)['body']>,
  res: Response
) => {
  try {
    const { body } = req;

    const createdUser = await userService.registerUser(body);

    res.status(HTTPCode.OK).send(createdUser);
  } catch (error) {
    if (isUniqueViolationError(error))
      return res
        .status(HTTPCode.BAD_REQUEST)
        .send({ message: 'User with that email already exists' });

    res.status(HTTPCode.BAD_REQUEST).send({ message: 'Could not create user' });
  }
};

export const findUser = async (req: Request, res: Response) => {
  try {
    const { user } = req;

    const userId = getUserIdFromToken(user.payload);

    const foundUser = await userService.getUser(userId);

    const sanitizedUser = sanitizeUser(foundUser);

    res.status(HTTPCode.OK).send(sanitizedUser);
  } catch (error) {
    if (error instanceof ApiError)
      return res.status(HTTPCode.BAD_REQUEST).send({ message: error.message });

    return res
      .status(HTTPCode.BAD_REQUEST)
      .send({ message: 'Could not find user' });
  }
};
