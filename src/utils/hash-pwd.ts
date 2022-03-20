import * as crypto from 'crypto';

const DEFAULT_CRYPTO_KEY = 'erho o oHOoHO#hf83hf3fO#oif#OFh3o8ho8f';
const ALGORITHM = 'sha512';
const ENCODING = 'hex';

const getCryptoKey = () => {
  return process.env.CRYPTO_KEY ?? DEFAULT_CRYPTO_KEY;
};

export const hashPwd = (p: string): string => {
  const hmac = crypto.createHmac(ALGORITHM, getCryptoKey());
  hmac.update(p);

  return hmac.digest(ENCODING);
};
