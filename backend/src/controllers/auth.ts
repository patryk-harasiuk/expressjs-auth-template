import { loginSchema, refreshTokenSchema } from '../schemas/auth.js';
import { TypedRequestBody } from '../middlewares/validate-request.js';
import { Request, Response } from 'express';
import { authService } from '../services/index.js';
import { createCookiePair } from '../utils/jwt.js';
import { HTTPCode } from '../types/http.js';
import { ApiError } from '../errors/api-error.js';

export const refresh = async (req: Request, res: Response) => {
  try {
    const cookies = req.cookies;
    const parsed = refreshTokenSchema.safeParse(cookies);

    if (parsed.success === false)
      return res
        .status(HTTPCode.UNAUTHORIZED)
        .send({ message: 'Could not find cookies' });

    const { refresh } = parsed.data;

    const { accessToken, refreshToken } = await authService.refreshTokenPair(
      refresh
    );

    const { accessTokenCookie, refreshTokenCookie } = createCookiePair(
      accessToken,
      refreshToken
    );

    res.setHeader('set-cookie', [accessTokenCookie, refreshTokenCookie]);
    res.status(200).send({ message: 'Successfully refreshed tokens' });
  } catch (error) {
    if (error instanceof ApiError)
      return res.status(HTTPCode.UNAUTHORIZED).send({ message: error.message });

    res
      .status(HTTPCode.UNAUTHORIZED)
      .send({ message: 'Could not refresh tokens' });
  }
};

export const login = async (
  req: TypedRequestBody<(typeof loginSchema)['body']>,
  res: Response
) => {
  try {
    const {
      body: { email, password },
    } = req;

    const { accessToken, refreshToken } = await authService.login(
      email,
      password
    );

    const { accessTokenCookie, refreshTokenCookie } = createCookiePair(
      accessToken,
      refreshToken
    );

    res
      .setHeader('set-cookie', [accessTokenCookie, refreshTokenCookie])
      .status(HTTPCode.OK)
      .send({ message: 'Logged in' });
  } catch (error) {
    if (error instanceof ApiError)
      return res.status(HTTPCode.BAD_REQUEST).send({ message: error.message });

    res.status(HTTPCode.BAD_REQUEST).send({ message: 'Could not log in' });
  }
};
