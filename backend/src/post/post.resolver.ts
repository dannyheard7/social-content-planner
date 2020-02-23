import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PostInput } from './PostInput';

import { GqlAuthGuard } from '../authz/auth.guard';
import { PostService } from './post.service';
import { Post } from './Post.entity';
import { PublisherService } from '../publisher/publisher.service';

@Resolver(of => Boolean)
export class PostResolver {
  constructor(
    private readonly postService: PostService,
    private readonly publisherService: PublisherService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args({ name: 'post', type: () => PostInput }) postInput: PostInput,
  ) {
    const post = await this.postService.create(postInput);
    await this.publisherService.publishToFacebook(post);
    return post;
  }
}
