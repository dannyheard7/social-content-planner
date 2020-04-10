import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class FacebookPageInstagramAccount {
    constructor(id: string, username: string, profilePicture: string) {
        this.id = id;
        this.username = username;
        this.profilePicture = profilePicture;
    }

    @Field()
    id: string;
    @Field()
    username: string;
    @Field()
    profilePicture: string
}