import { Field, InputType, ID } from 'type-graphql';
import Platform from './Platform';

@InputType()
export class AddPlatformConnectionInput {
  @Field(type => ID)
  entityId: string;
  @Field(type => String)
  accessToken: string;
  @Field(type => Platform)
  platform: Platform;
  @Field(type => String, { nullable: true })
  platformUserId?: string;
}
