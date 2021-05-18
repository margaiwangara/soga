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
import { sendEmail } from '../utils/sendEmail';
import { FORGOT_PASSWORD_PREFIX } from '../constants';

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
  async me(@Ctx() { req, em }: MyContext): Promise<User | null> {
    // if not logged in
    if (!req.session.userId) {
      return null;
    }
    const user = await em.findOne(User, { id: req.session.userId });

    return user;
  }

  @Mutation(() => User)
  async register(
    @Arg('input', () => RegisterUserInput) input: RegisterUserInput,
    @Ctx() { em }: MyContext,
  ): Promise<User> {
    const { password, ...rest } = input;

    const hashed = await argon2.hash(password);
    const user = await em.create(User, { ...rest, password: hashed });
    await em.persistAndFlush(user);

    return user;
  }

  @Mutation(() => LoginUserResponse)
  async login(
    @Arg('input', () => EmailPasswordInput) input: EmailPasswordInput,
    @Ctx() { em, req }: MyContext,
  ): Promise<LoginUserResponse> {
    const { email, password } = input;
    const user = await em.findOne(User, { email });

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
    @Ctx() { em, redis }: MyContext,
  ) {
    // check if user exists
    const user = await em.findOne(User, { email });

    if (!user) {
      return true;
    }

    const token = uuidv4();
    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3,
    ); // 3 days to expire

    const resetLink = `<a href="${env.CLIENT_URL}/reset-password/${token}">Reset Password</a>`;

    await sendEmail(
      user.email,
      `To reset your password please click on the link below:<br/><br/>${resetLink}<br/>`,
      'Reset Your Password',
    );

    return true;
  }

  @Mutation(() => Boolean)
  async resetPassword(
    @Arg('token') token: string,
    @Arg('password') password: string,
    @Ctx() { em, redis }: MyContext,
  ) {
    if (!password) {
      return false;
    }

    const key = FORGOT_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);

    if (!userId) {
      return false;
    }

    const user = await em.findOne(User, { id: parseInt(userId) });

    if (!user) {
      return false;
    }

    const hashedPassword = await argon2.hash(password);
    user.password = hashedPassword;
    await em.persistAndFlush(user);

    // delete token from Redis
    await redis.del(key);

    return true;
  }
}
