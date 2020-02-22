import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PostInput } from './PostInput';

import { GqlAuthGuard } from '../authz/auth.guard';

@Resolver(of => Boolean)
export class PostResolver {
  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async createPost(
    @Args({ name: 'post', type: () => PostInput }) post: PostInput,
  ) {
    console.log(post);
    return true;
  }
}
