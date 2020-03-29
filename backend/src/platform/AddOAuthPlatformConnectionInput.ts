import { Field, InputType, ID } from '@nestjs/graphql';
import Platform from './Platform';


@InputType()
export class AddOAuthPlatformConnectionInput {
  @Field(type => String)
  oauthToken: string;
  @Field(type => String)
  oauthTokenSecret: string;
  @Field(type => String)
  oauthVerifier: string;
  @Field(type => Platform)
  platform: Platform;
}
