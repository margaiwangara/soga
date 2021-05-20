import { cleanEnv, str, num } from 'envalid';
import { config } from 'dotenv';
import path from 'path';

// config dotenv
config({ path: path.resolve(__dirname, '.env') });

const env = cleanEnv(process.env, {
  // port
  PORT: num(),

  // session and cookie
  SESSION_SECRET: str(),
  COOKIE_EXPIRE: str(),
  COOKIE_NAME_AUTH: str(),
});

export default env;
