import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SendFeebackInput {
  @Field(type => String)
  message: string;
}