import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class OAuthTokenResult {
    constructor(oauthToken: string, oauthTokenSecret: string) {
        this.oauthToken = oauthToken;
        this.oauthTokenSecret = oauthTokenSecret;
    }

    oauthToken: string;
    oauthTokenSecret: string;
}