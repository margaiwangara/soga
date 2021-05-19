import { ApolloServer } from 'apollo-server-express';
import connectRedis from 'connect-redis';
import cors from 'cors';
import express from 'express';
// import redis from 'redis';
import session from 'express-session';
import http from 'http';
import Redis from 'ioredis';
import 'reflect-metadata';
// import { sendEmail } from './utils/sendEmail';
import { Server, Socket } from 'socket.io';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { corsConfig, sessionConfig, typeOrmConfig } from './config';
import env from './env';
import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { MyContext } from './types';
import { OnlineUser } from './utils/websocket';

const main = async () => {
  try {
    // configure and connect to typeorm
    await createConnection(typeOrmConfig);

    const app = express();

    // Session Config with Redis
    const RedisStore = connectRedis(session);
    const redis = new Redis();

    const sessionMiddleware = session(sessionConfig(RedisStore, redis));
    app.use(sessionMiddleware);

    // init middleware
    app.use(cors(corsConfig));

    // socketio connect
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: corsConfig,
    });

    // initialize users
    let users: OnlineUser[] = [];

    const addOnlineUser = (userId: string, socketId: string) => {
      if (userId) {
        !users.some((user) => user.userId === userId) &&
          users.push({ userId, socketId });
      }
    };

    const removeOnlineUser = (socketId: string) => {
      users = users.filter((user) => user.socketId !== socketId);
    };

    io.on('connection', (socket: Socket) => {
      console.log('Client is connected');

      // const userId = socket.handshake.query.userId as string;

      socket.on('addUser', (userId) => {
        addOnlineUser(userId, socket.id);
        io.emit('getUsers', users);
      });

      socket.on('disconnect', () => {
        console.log('Client is disconnected');
        removeOnlineUser(socket.id);
        io.emit('getUsers', users);
      });
    });

    // Apollo Server
    const apolloServer = new ApolloServer({
      schema: await buildSchema({
        resolvers: [HelloResolver, PostResolver, UserResolver],
        validate: false,
      }),
      context: ({ req, res }): MyContext => ({ req, res, redis }),
    });

    // apply express middleware to apollo
    apolloServer.applyMiddleware({ app, cors: false });

    const PORT = env.PORT || 2111;
    server.listen(PORT, () =>
      console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`),
    );
    // add data to table
    // const post = await orm.em.create(Post, { title: 'Hello World!' });
    // await orm.em.persistAndFlush(post);
  } catch (error) {
    console.log('main initialization error', error);
  }
};

main();
