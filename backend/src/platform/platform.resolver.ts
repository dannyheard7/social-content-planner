import { UseGuards } from '@nestjs/common';
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { GqlAuthGuard } from '../authz/auth.guard';
import { CurrentUser } from '../authz/current.user.decorator';
import { AddPlatformConnectionInput } from './AddPlatformConnectionInput';
import { PlatformConnectionService } from './platformConnection.service';

@Resolver()
export class PlatformResolver {
  constructor(
    private readonly platformConnectionService: PlatformConnectionService,
  ) {}

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
    await this.platformConnectionService.create(platformConnectionInput, user);
    return true;
  }
}
