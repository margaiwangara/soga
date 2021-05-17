import { cleanEnv, str, url, num } from 'envalid';
import { config } from 'dotenv';
import path from 'path';

// config dotenv
config({ path: path.resolve(__dirname, '.env') });

console.log('process.env', process.env);

const env = cleanEnv(process.env, {
  // PORT
  PORT: num(),

  // URL FOR THE CLIENT/WEB
  CLIENT_URL: url(),

  // CURRENT NODE ENVIRONMENT
  NODE_ENV: str(),

  // SESSION AND COOKIE
  SESSION_SECRET: str(),
  COOKIE_EXPIRE: num(),
});

export default env;
