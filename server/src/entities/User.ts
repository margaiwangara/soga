import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryKey()
  id!: number;

  @Field(() => String)
  @Property()
  name!: string;

  @Field(() => String, { nullable: true })
  @Property({ nullable: true })
  surname: string;

  @Field(() => String)
  @Property({ unique: true })
  email!: string;

  @Property()
  password!: string;

  @Field(() => String)
  @Property({ type: 'date' })
  createdAt = new Date();

  @Field(() => String)
  @Property({ onUpdate: () => new Date(), type: 'date' })
  updatedAt = new Date();
}
