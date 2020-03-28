import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { GqlAuthGuard } from '../authz/auth.guard';
import { CurrentUser } from '../authz/current.user.decorator';
import { AddPlatformConnectionInput } from './AddPlatformConnectionInput';
import { PlatformConnectionService } from './platform-connection.service';
import { PlatformConnection } from './PlatformConnection.entity';
import Platform from './Platform';
import { OAuthTokenResult } from './OAuthTokenResult.entity';
import { AddOAuthPlatformConnectionInput } from './AddOAuthPlatformConnectionInput';

@Resolver()
export class PlatformResolver {
  constructor(
    private readonly platformConnectionService: PlatformConnectionService,
  ) { }

  @UseGuards(GqlAuthGuard)
  @Query(() => [PlatformConnection])
  async platformConnections(@CurrentUser() user: User) {
    return await this.platformConnectionService.getAllForUser(user);
  }

  @UseGuards(GqlAuthGuard)
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

  @UseGuards(GqlAuthGuard)
  @Mutation(of => Boolean)
  async addPlatformConnection(
    @Args({
      name: 'platformConnection',
      type: () => AddPlatformConnectionInput,
    })
    platformConnectionInput: AddPlatformConnectionInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    await this.platformConnectionService.create(user, platformConnectionInput);
    return true;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(of => Boolean)
  async addOAuthPlatformConnection(
    @Args({
      name: 'platformConnection',
      type: () => AddOAuthPlatformConnectionInput,
    })
    input: AddOAuthPlatformConnectionInput,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    const oauthAccessToken = await this.platformConnectionService.getOAuthAccessToken(
      input.platform, input.oauthToken, input.oauthTokenSecret, input.oauthVerifier);
    await this.platformConnectionService.create(user, undefined, oauthAccessToken);
    return true;
  }


}
