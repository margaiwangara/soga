import { User } from '../entities/User';
import { MyContext } from '../types';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from 'type-graphql';
import argon2 from 'argon2';

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
}
