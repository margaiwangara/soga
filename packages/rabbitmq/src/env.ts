import { cleanEnv, str } from 'envalid';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env') });

const env = cleanEnv(process.env, {
  MESSAGE_QUEUE_CONNECTION_STRING: str(),
});

export default env;
