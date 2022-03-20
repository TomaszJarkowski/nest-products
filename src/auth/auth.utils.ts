import { Environments } from 'src/environments/environments.enum';
import {
  DEFAULT_JWT_EXPIRE_TIME,
  DEFAULT_JWT_SECRET,
  DEFAULT_DOMAIN,
  DEFAULT_FRONTEND_URL,
} from './auth.constants';

export const getJwtSecret = () => {
  return process.env.JWT_SECRET ?? DEFAULT_JWT_SECRET;
};

export const getJwtExpireTime = () => {
  return process.env.JWT_EXPIRE_TIME ?? DEFAULT_JWT_EXPIRE_TIME;
};

export const getFrontendURL = () => {
  return process.env.FRONTEND_URL ?? DEFAULT_FRONTEND_URL;
};

export const getCookieOptions = (env: string) => {
  if (env === Environments.local) {
    return {
      secure: false,
      domain: DEFAULT_DOMAIN,
      httpOnly: true,
    };
  } else {
    return {
      secure: true,
      domain: process.env.DOMAIN ?? DEFAULT_DOMAIN,
      httpOnly: true,
    };
  }
};
