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

const main = async () => {
  try {
    const orm = await MikroORM.init(microOrmConfig);

    // run migrations
    await orm.getMigrator().up();

    const app = express();

    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver, UserResolver],
        validate: false,
      }),
      context: () => ({ em: orm.em }),
    });
    const PORT = process.env.PORT || 2111;

    apolloServer.applyMiddleware({ app });

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    // add data to table
    // const post = await orm.em.create(Post, { title: 'Hello World!' });
    // await orm.em.persistAndFlush(post);
  } catch (error) {
    console.log('initialization of mikro-orm error', error);
  }
};

main();
