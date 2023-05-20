import { NextFunction, Request, Response } from 'express';
import { TOKENS } from '../const/tokens.js';
import { HTTPCode } from '../types/http.js';
import { decodeToken } from '../utils/jwt.js';

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { cookies } = req;

  if (!cookies)
    return res
      .status(HTTPCode.UNAUTHORIZED)
      .send({ message: 'Access token is missing' });

  if (!cookies['access'])
    return res
      .status(HTTPCode.UNAUTHORIZED)
      .send({ message: 'Access token is missing', issue: 'access_token' });

  const accessToken = cookies['access'];

  try {
    const tokenData = decodeToken(accessToken, TOKENS.ACCESS);

    req.user = tokenData;
    next();
  } catch {
    return res
      .status(HTTPCode.UNAUTHORIZED)
      .send({ message: 'Authentication failed' });
  }
};
