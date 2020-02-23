import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PostInput } from './PostInput';

import { GqlAuthGuard } from '../authz/auth.guard';
import { PostService } from './post.service';
import { Post } from './Post.entity';

@Resolver(of => Boolean)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args({ name: 'post', type: () => PostInput }) post: PostInput,
  ) {
    return await this.postService.create(post);
  }
}
