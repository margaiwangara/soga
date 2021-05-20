import { User } from '../entities/User';
import { MyContext } from '../types';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from 'type-graphql';
import argon2 from 'argon2';
import env from '../env';
import { v4 as uuidv4 } from 'uuid';
import { CONFIRM_EMAIL_PREFIX, FORGOT_PASSWORD_PREFIX } from '../constants';
import amqp from 'amqplib';
import { storeTokenInRedis } from '../utils/storeTokenInRedis';
import { publishToChannel } from '../utils/rabbitMQOperations';
import { env as envBase, MailSituations } from '@soga/shared';

@InputType()
class EmailPasswordInput {
  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
class RegisterUserInput extends EmailPasswordInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  surname: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class LoginUserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    // if not logged in
    if (!req.session.userId) {
      return;
    }

    return await User.findOne(req.session.userId);
  }

  @Mutation(() => User)
  async register(
    @Arg('input', () => RegisterUserInput) input: RegisterUserInput,
    @Ctx() { redis }: MyContext,
  ): Promise<User> {
    const { password, ...rest } = input;

    const hashed = await argon2.hash(password);

    const user = await User.create({ ...rest, password: hashed }).save();

    // create a token for email confirmation
    const token = uuidv4();
    await storeTokenInRedis(redis, CONFIRM_EMAIL_PREFIX + token, user.id, 30);

    // connect to RabbitMQ and add to queue
    const connection = await amqp.connect(
      envBase.MESSAGE_QUEUE_CONNECTION_STRING,
    );
    const channel = await connection.createConfirmChannel();
    console.log('Publishing a request message to RabbitMQ Queue');
    await publishToChannel(channel, {
      routingKey: 'request',
      exchangeName: 'processing',
      data: {
        userId: user.id,
        userEmail: user.email,
        token,
        situation: MailSituations.CONFIRM_EMAIL,
      },
    });

    return user;
  }

  @Mutation(() => LoginUserResponse)
  async login(
    @Arg('input', () => EmailPasswordInput) input: EmailPasswordInput,
    @Ctx() { req }: MyContext,
  ): Promise<LoginUserResponse> {
    const { email, password } = input;
    const user = await User.findOne({ email });

    if (!user) {
      return {
        errors: [
          {
            field: 'email',
            message: 'email does not exist',
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'invalid password',
          },
        ],
      };
    }

    // session store token
    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve) =>
      req.session.destroy((error) => {
        if (error) {
          console.log('logout error', error);
          resolve(false);
          return;
        }

        res.clearCookie(env.COOKIE_NAME_AUTH);
        resolve(true);
      }),
    );
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext,
  ) {
    // check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return true;
    }

    const token = uuidv4();
    await storeTokenInRedis(redis, FORGOT_PASSWORD_PREFIX + token, user.id, 3); // 3 days to expire

    // connect to RabbitMQ and add to queue
    const connection = await amqp.connect(
      envBase.MESSAGE_QUEUE_CONNECTION_STRING,
    );
    const channel = await connection.createConfirmChannel();
    console.log('Publishing a request message to RabbitMQ Queue');
    await publishToChannel(channel, {
      routingKey: 'request',
      exchangeName: 'processing',
      data: {
        userId: user.id,
        userEmail: user.email,
        token,
        situation: MailSituations.FORGOT_PASSWORD,
      },
    });

    return true;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg('token') token: string,
    @Arg('password') password: string,
    @Ctx() { redis }: MyContext,
  ) {
    if (!password) {
      return false;
    }

    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);

    if (!userId) {
      return false;
    }

    const user = await User.findOne(parseInt(userId));

    if (!user) {
      return false;
    }

    const hashedPassword = await argon2.hash(password);

    await User.update({ id: user.id }, { password: hashedPassword });

    // delete token from Redis
    await redis.del(key);

    return true;
  }

  @Mutation(() => Boolean)
  async confirmEmail(@Arg('token') token: string, @Ctx() { redis }: MyContext) {
    const key = CONFIRM_EMAIL_PREFIX + token;
    const userId = await redis.get(key);

    if (!userId) {
      return false;
    }

    const user = await User.findOne(parseInt(userId));

    if (!user) {
      return false;
    }

    // delete token from Redis
    await redis.del(key);

    return true;
  }
}
