type Envs = {
  readonly ENV: 'production' | 'test' | 'development';
  readonly POSTGRES_PORT: number;
  readonly POSTGRES_USER: string;
  readonly POSTGRES_PASSWORD: string;
  readonly POSTGRES_DB: string;
  readonly POSTGRES_HOST: string;
  readonly DATABASE_URL: string;
  readonly FRONTEND_URL: string;
  readonly ACCESS_TOKEN_SECRET: string;
  readonly ACCESS_TOKEN_EXPIRATION: string;
  readonly REFRESH_TOKEN_EXPIRATION: string;
};

export function getEnv<Env extends keyof Envs>(name: Env): Envs[Env];
export function getEnv(name: keyof Envs): Envs[keyof Envs] {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Cannot find environmental variable ${name}`);
  }

  return value;
}
