import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../authz/auth.guard';
import { CurrentUser } from '../authz/current.user.decorator';

@Resolver()
export class SocialProviderResolver {
  @UseGuards(GqlAuthGuard)
  @Mutation()
  async addSocialProvider(@CurrentUser() user: any): Promise<boolean> {
    console.log(user);
    return true;
  }
}
