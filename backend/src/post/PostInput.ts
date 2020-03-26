import { Field, InputType, ID } from '@nestjs/graphql';

@InputType()
export class PostInput {
  @Field()
  text: string;
  @Field(type => [ID])
  images: string[];
  @Field(type => [ID])
  platformConnections: string[];
}
