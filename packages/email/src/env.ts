import { cleanEnv, num } from 'envalid';
import { config } from 'dotenv';
import path from 'path';

// config dotenv
config({ path: path.resolve(__dirname, '.env') });

const env = cleanEnv(process.env, {
  // port
  PORT: num(),
});

export default env;
