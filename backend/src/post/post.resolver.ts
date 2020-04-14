import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { GqlAuthGuard } from '../authz/auth.guard';
import { CurrentUser } from '../authz/current.user.decorator';
import { Post } from './Post.entity';
import { PostService } from './post.service';
import { PostInput } from './PostInput';
import { PublisherService } from './publisher.service';
import { PostStatusService } from './status/post-status.service';
import { AggregatedStatus } from './status/AggregatedStatus';
import { StatusDifferential } from './status/StatusDifferential';


@Resolver(of => Post)
export class PostResolver {
    constructor(
        private readonly postService: PostService,
        private readonly publisherService: PublisherService,
        private readonly postStatusService: PostStatusService
    ) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => Post)
    async post(
        @Args({ name: 'id', type: () => ID }) postId: string,
        @CurrentUser() user: User,
    ) {
        return await this.postService.findByIdAndUser(postId, user);
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

        await Promise.all([
            this.publisherService.publishPost(post),
            this.postStatusService.schedulePostStatusPolling(post)
        ]);

        return post;
    }

    @ResolveField(of => [AggregatedStatus])
    async status(@Parent() post: Post) {
        return await this.postStatusService.getAggregatedStatuses(post);
    }

    @ResolveField(of => AggregatedStatus, { nullable: true })
    async latestStatus(@Parent() post: Post) {
        return await this.postStatusService.getLatestAggregatedStatus(post);
    }

    @ResolveField(of => StatusDifferential, { nullable: true })
    async engagementDifferential(@Parent() post: Post) {
        return await this.postStatusService.getEngagementDifferential(post);
    }
}
