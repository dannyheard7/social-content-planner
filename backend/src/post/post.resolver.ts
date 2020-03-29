import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../authz/auth.guard';
import { CurrentUser } from '../authz/current.user.decorator';
import { Post } from './Post.entity';
import { PostService } from './post.service';
import { PostInput } from './PostInput';
import { PublisherService } from './publisher.service';


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
    const post = await this.postService.findById(postId);
    if (post.userId === user.sub) throw new UnauthorizedException("You cannot access this post");
    return post;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Post])
  async posts(
    @CurrentUser() user: User,
  ) {
    // TODO: make this a connection
    return await this.postService.getAllForUser(user);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Post)
  async createPost(
    @Args({ name: 'post', type: () => PostInput }) postInput: PostInput,
    @CurrentUser() user: User,
  ) {
    const post = await this.postService.create(postInput, user);
    await this.publisherService.publishPost(post);

    return post;
  }
}
