import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class PostImage {
  @Field()
  filename: string;
}
