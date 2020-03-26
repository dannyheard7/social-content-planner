import { Field, ObjectType } from "type-graphql";

@ObjectType('TwitterOAuthResult')
export class TwitterOAuthResult {
    constructor(oauthToken: string, oauthTokenSecret: string) {
        this.oauthToken = oauthToken;
        this.oauthTokenSecret = oauthTokenSecret;
    }

    @Field(type => String)
    oauthToken: string;
    @Field(type => String)
    oauthTokenSecret: string;
}