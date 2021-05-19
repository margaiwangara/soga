import { Redis } from 'ioredis';

export async function storeTokenInRedis(
  redis: Redis,
  key: string,
  value: any,
  durationInDays: number = 3,
) {
  return await redis.set(
    key,
    value,
    'ex',
    1000 * 60 * 60 * 24 * durationInDays,
  );
}
