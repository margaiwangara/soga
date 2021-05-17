import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import microOrmConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';
import env from './env';
import cors from 'cors';

const main = async () => {
  try {
    const orm = await MikroORM.init(microOrmConfig);

    // run migrations
    await orm.getMigrator().up();

    const app = express();

    // Session Config with Redis
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
      session({
        name: 'auth',
        store: new RedisStore({ client: redisClient, disableTouch: true }),
        secret: env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge:
            1000 * 60 * 60 * 24 * 365 * parseInt(env.COOKIE_EXPIRE.toString()), // 10 years
          httpOnly: true,
          sameSite: 'lax',
          secure: __prod__, // cookie only works in https
        },
      }),
    );

    // init middleware
    app.use(
      cors({
        origin: env.CLIENT_URL,
        credentials: true,
      }),
    );

    // Apollo Server
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver, UserResolver],
        validate: false,
      }),
      context: ({ req, res }): MyContext => ({ em: orm.em, req, res }),
    });

    // apply express middleware to apollo
    apolloServer.applyMiddleware({ app, cors: false });

    const PORT = env.PORT || 2111;
    app.listen(PORT, () =>
      console.log(`Server running on port in ${env.NODE_ENV} mode on ${PORT}`),
    );
    // add data to table
    // const post = await orm.em.create(Post, { title: 'Hello World!' });
    // await orm.em.persistAndFlush(post);
  } catch (error) {
    console.log('initialization of mikro-orm error', error);
  }
};

main();
