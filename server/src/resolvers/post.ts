import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../types';
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { Post } from '../entities/Post';

@InputType()
class CreatePostInput {
  @Field()
  title: string;

  @Field()
  content: string;
}
@InputType()
class UpdatePostInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  content?: string;
}

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  async posts(): Promise<Post[]> {
    return await Post.find();
  }

  @Query(() => Post, { nullable: true })
  async post(@Arg('id') id: number): Promise<Post | undefined> {
    return await Post.findOne(id);
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async createPost(
    @Arg('input') input: CreatePostInput,
    @Ctx() { req }: MyContext,
  ): Promise<Post> {
    if (!req.session.userId) {
      throw new Error('not authenticated');
    }

    const post = await Post.create({
      ...input,
      creatorId: req.session.userId,
    }).save();

    return post;
  }

  @Mutation(() => Post, { nullable: false })
  @UseMiddleware(isAuth)
  async updatePost(
    @Arg('id', () => Int) id: number,
    @Arg('input', () => UpdatePostInput, { nullable: true })
    input: UpdatePostInput,
    @Ctx() { req }: MyContext,
  ): Promise<Post | null> {
    const post = await Post.findOne(id);

    if (!post) {
      return null;
    }

    const isEitherUndefined = input.title || input.content;

    if (!isEitherUndefined) {
      throw new Error('invalid input');
    }

    if (req.session.userId !== post.creatorId) {
      throw new Error('unauthorized action');
    }

    await Post.update(id, input);

    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id', () => Int) id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
