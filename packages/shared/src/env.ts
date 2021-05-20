import { cleanEnv, str, url } from 'envalid';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '.env') });

const env = cleanEnv(process.env, {
  // url for the client/web
  CLIENT_URL: url(),

  // node env
  NODE_ENV: str(),

  // email sending
  SMTP_USERNAME: str(),
  SMTP_PASSWORD: str(),
  FROM_NOREPLY: str(),

  // rabbitMQ config
  MESSAGE_QUEUE_CONNECTION_STRING: str(),
  MAILING_QUEUE_NAME: str(),
});

export default env;
