import { cleanEnv, str, url, num } from 'envalid';
import { config } from 'dotenv';
import path from 'path';

// config dotenv
config({ path: path.resolve(__dirname, '.env') });

const env = cleanEnv(process.env, {
  // port
  PORT: num(),

  // url for the client/web
  CLIENT_URL: url(),

  // node env
  NODE_ENV: str(),

  // session and cookie
  SESSION_SECRET: str(),
  COOKIE_EXPIRE: str(),
  COOKIE_NAME_AUTH: str(),

  // email sending
  SMTP_USERNAME: str(),
  SMTP_PASSWORD: str(),
  FROM_NOREPLY: str(),
});

export default env;
