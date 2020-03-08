import { Field, InputType, ID } from 'type-graphql';

@InputType()
export class AddPlatformConnectionInput {
  @Field(type => ID)
  entityId: string;
  @Field(type => String)
  accessToken: string;
}
