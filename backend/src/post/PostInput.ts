import { Field, InputType } from 'type-graphql';

@InputType()
export class PostInput {
  @Field()
  text: string;
  @Field(type => [String])
  images: string[];
  @Field(type => [String])
  networks: string[];
}
