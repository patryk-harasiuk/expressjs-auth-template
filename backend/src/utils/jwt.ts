import { randomUUID } from 'crypto';

import { TOKENS } from '../const/tokens.js';
import { serialize } from 'cookie';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import { hasDefinedProperty } from './has-defined-property.js';
import { getEnv } from './env.js';
import { ApiError } from '../errors/api-error.js';

// I check for 'jti' and 'sub', because I will be using only those properties
export const isJWTPayload = (
  payload: string | JwtPayload
): payload is JwtPayload =>
  (payload as JwtPayload).jti !== undefined &&
  (payload as JwtPayload).sub !== undefined;

export const createTokenPair = async (userId: string) => {
  const accessToken = jwt.sign(
    { type: TOKENS.ACCESS },
    getEnv('ACCESS_TOKEN_SECRET'),
    {
      expiresIn: process.env['ACCESS_TOKEN_EXPIRATION'],
      jwtid: randomUUID(),
      subject: userId,
    }
  );

  const refreshToken = jwt.sign(
    { type: TOKENS.REFRESH },
    getEnv('ACCESS_TOKEN_SECRET'),
    {
      expiresIn: getEnv('REFRESH_TOKEN_EXPIRATION'),
      jwtid: randomUUID(),
      subject: userId,
    }
  );

  return { accessToken, refreshToken };
};

export const decodeToken = (token: string, tokenType: 'access' | 'refresh') => {
  try {
    const tokenData = jwt.verify(token, getEnv('ACCESS_TOKEN_SECRET'), {
      complete: true,
    });

    if (!isRightType(tokenData, tokenType))
      throw new Error('Invalid token type');

    return tokenData;
  } catch {
    throw new Error('Provided token is invalid');
  }
};

export const decodeTokenPayload = (
  token: string,
  tokenType: 'access' | 'refresh'
) => {
  const payload = decodeToken(token, tokenType)['payload'];

  if (!isJWTPayload(payload)) {
    throw new Error('Invalid token');
  }

  return payload;
};

export const getDecodedTokenPayloadData = (payload: JwtPayload) => {
  if (
    !hasDefinedProperty(payload, 'sub') ||
    !hasDefinedProperty(payload, 'jti')
  ) {
    throw new Error('Invalid token');
  }

  return { sub: payload['sub'], jti: payload['jti'] };
};

export const createCookiePair = (accessToken: string, refreshToken: string) => {
  const accessTokenCookie = serialize('access', accessToken, {
    maxAge: 60 * 60,
    httpOnly: true,
    secure: process.env['ENV'] === 'production',
    path: '/',
    sameSite: 'lax',
  });

  const refreshTokenCookie = serialize('refresh', refreshToken, {
    maxAge: 60 * 60 * 720,
    httpOnly: true,
    secure: process.env['ENV'] === 'production',
    path: '/',
    sameSite: 'lax',
  });

  return { accessTokenCookie, refreshTokenCookie };
};

export const getUserIdFromToken = (payload: string | JwtPayload) => {
  if (!isJWTPayload(payload)) throw new ApiError('Invalid token payload');

  const userId = getDecodedTokenPayloadData(payload)['sub'];

  return userId;
};

const isRightType = (
  tokenData: jwt.Jwt,
  tokenType: 'access' | 'refresh'
): boolean =>
  typeof tokenData.payload !== 'string' &&
  tokenData.payload?.type &&
  tokenData.payload.type === tokenType;
