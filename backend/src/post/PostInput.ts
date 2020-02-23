import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class PostInput {
  @Field()
  text: string;
  @Field(type => [ID])
  images: string[];
  @Field(type => [String])
  networks: string[];
}
