import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../authz/auth.guard';
import { CurrentUser } from '../authz/current.user.decorator';

@Resolver(of => Boolean)
export class SocialProviderResolver {
  @UseGuards(GqlAuthGuard)
  @Query(of => Boolean)
  async addSocialProvider(@CurrentUser() user: any): Promise<boolean> {
    return true;
  }
}
