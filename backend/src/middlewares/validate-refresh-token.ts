import { NextFunction, Request, Response } from 'express';
import { TOKENS } from '../const/tokens.js';
import { HTTPCode } from '../types/http.js';
import { decodeToken } from '../utils/jwt.js';

export const validateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cookies } = req;

  if (!cookies['refresh'])
    return res
      .status(HTTPCode.UNAUTHORIZED)
      .send({ message: 'Refresh token is missing' });

  const refreshToken = cookies['refresh'];

  if (!refreshToken)
    return res
      .status(HTTPCode.UNAUTHORIZED)
      .send({ message: 'Refresh token is missing' });

  try {
    decodeToken(refreshToken, TOKENS.REFRESH);

    next();
  } catch {
    return res
      .status(HTTPCode.UNAUTHORIZED)
      .send({ message: 'Refresh token is invalid or expired' });
  }
};
