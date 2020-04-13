import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuardJWT } from '../authz/auth.guard';
import { CurrentUser } from '../authz/current.user.decorator';
import { AddOAuthPlatformConnectionInput } from './AddOAuthPlatformConnectionInput';
import { AddPlatformConnectionInput } from './AddPlatformConnectionInput';
import { OAuthTokenResult } from './OAuthTokenResult.entity';
import Platform from './Platform';
import { PlatformConnectionService } from './platform-connection.service';
import { PlatformConnection } from './PlatformConnection.entity';

@Resolver()
export class PlatformResolver {
    constructor(
        private readonly platformConnectionService: PlatformConnectionService
    ) { }

    @UseGuards(GqlAuthGuardJWT)
    @Query(() => [PlatformConnection])
    async platformConnections(@CurrentUser() user: User) {
        return await this.platformConnectionService.getAllForUser(user);
    }

    @UseGuards(GqlAuthGuardJWT)
    @Query(of => OAuthTokenResult)
    async getPlatformOAuthRequestToken(
        @Args({
            name: 'platform',
            type: () => Platform,
        })
        platform: Platform,
        @Args({
            name: 'callbackUrl',
            type: () => String,
        })
        callbackUrl: string
    ): Promise<OAuthTokenResult> {
        return await this.platformConnectionService.getOAuthRequestToken(platform, callbackUrl);
    }

    @UseGuards(GqlAuthGuardJWT)
    @Mutation(of => PlatformConnection)
    async addPlatformConnection(
        @Args({
            name: 'platformConnection',
            type: () => AddPlatformConnectionInput,
        })
        platformConnectionInput: AddPlatformConnectionInput,
        @CurrentUser() user: User,
    ): Promise<PlatformConnection> {
        return await this.platformConnectionService.create(user, platformConnectionInput.platform, platformConnectionInput);
    }

    @UseGuards(GqlAuthGuardJWT)
    @Mutation(of => PlatformConnection)
    async addOAuthPlatformConnection(
        @Args({
            name: 'platformConnection',
            type: () => AddOAuthPlatformConnectionInput,
        })
        input: AddOAuthPlatformConnectionInput,
        @CurrentUser() user: User,
    ): Promise<PlatformConnection> {
        const oauthAccessToken = await this.platformConnectionService.getOAuthAccessToken(
            input.platform, input.oauthToken, input.oauthTokenSecret, input.oauthVerifier);
        return await this.platformConnectionService.create(user, input.platform, undefined, oauthAccessToken);
    }
}
