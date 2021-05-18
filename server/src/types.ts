import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Session } from 'express-session';
import { Redis } from 'ioredis';
export interface MyContext {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
  req: Request & { session: Session & Partial<Session> & { userId?: number } };
  res: Response;
  redis: Redis;
}
