import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import path from 'path';

export default {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[jt]s$/,
  },
  entities: [Post],
  dbName: 'soga',
  type: 'postgresql',
  debug: !__prod__,
  clientUrl: 'postgresql://postgres:postgres@127.0.0.1',
  port: 5432,
} as Parameters<typeof MikroORM.init>[0];
