import * as bcrypt from 'bcrypt';

export const createHash = async (data: string): Promise<string> => {
  const hashedData = await bcrypt.hash(data, 10);

  return hashedData;
};

export const comparePasswords = async (
  password: string,
  userPassword: string
) => {
  const match = await bcrypt.compare(password, userPassword);

  return match;
};
