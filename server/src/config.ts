import { __prod__ } from './constants';
import env from './env';
import { RedisStore } from 'connect-redis';
import { Redis } from 'ioredis';

export const corsConfig = {
  origin: env.CLIENT_URL,
  credentials: true,
} as const;

export const sessionConfig = (RedisStore: RedisStore, redisClient: Redis) => ({
  name: env.COOKIE_NAME_AUTH,
  store: new RedisStore({ client: redisClient, disableTouch: true }),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: eval(env.COOKIE_EXPIRE.toString()),
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: __prod__, // cookie only works in https
  },
});
