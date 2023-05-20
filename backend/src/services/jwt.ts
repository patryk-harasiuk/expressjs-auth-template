/* eslint-disable no-useless-catch */
import { TOKENS } from '../const/tokens.js';
import { users } from '../data_access/user.js';
import { refreshTokens } from '../data_access/jwt.js';
import { comparePasswords } from '../utils/password.js';
import {
  decodeToken,
  isJWTPayload,
  createTokenPair,
  decodeTokenPayload,
  getDecodedTokenPayloadData,
} from '../utils/jwt.js';

export const login = async (email: string, password: string) => {
  try {
    const foundUser = await users.findByEmail(email);

    if (!foundUser) throw new Error('Could not find user');

    if (!comparePasswords(foundUser.password, password)) {
      throw new Error('Provided credentials are invalid');
    }

    const { accessToken, refreshToken } = await createTokenPair(foundUser.id);

    const payload = decodeToken(refreshToken, TOKENS.REFRESH)['payload'];

    if (!isJWTPayload(payload)) {
      throw new Error('Invalid refresh token');
    }

    const jti = getDecodedTokenPayloadData(payload)['jti'];

    await refreshTokens.createRefreshToken(foundUser.id, jti);

    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

export const refreshTokenPair = async (currentRefreshToken: string) => {
  try {
    const payload = decodeTokenPayload(currentRefreshToken, TOKENS.REFRESH);

    const tokenPayload = getDecodedTokenPayloadData(payload);

    const tokenPair = await createTokenPair(tokenPayload['sub']);

    await refreshTokens.deleteByJTI(tokenPayload['jti']);

    const newPayload = decodeTokenPayload(
      tokenPair.refreshToken,
      TOKENS.REFRESH
    );

    await refreshTokens.createRefreshToken(
      tokenPayload['sub'],
      getDecodedTokenPayloadData(newPayload)['jti']
    );

    return tokenPair;
  } catch (error) {
    throw error;
  }
};
