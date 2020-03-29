import { UseGuards, forwardRef, Inject } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PostInput } from './PostInput';

import { GqlAuthGuard } from '../authz/auth.guard';
import { PostService } from './post.service';
import { Post } from './Post.entity';
import { PublisherService } from './publisher.service';
import { CurrentUser } from '../authz/current.user.decorator';
import { ID } from '@nestjs/graphql';

@Resolver()
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly publisherService: PublisherService,
  ) { }

  @UseGuards(GqlAuthGuard)
  @Query(() => Post)
  async post(
    @Args({ name: 'id', type: () => ID }) postId: string,
    @CurrentUser() user: User,
  ) {
    return await this.postService.findById(postId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args({ name: 'post', type: () => PostInput }) postInput: PostInput,
    @CurrentUser() user: User,
  ) {
    const post = await this.postService.create(postInput, user);
    const postPlatforms = await this.publisherService.publishPost(post);

    return post;
  }
}
