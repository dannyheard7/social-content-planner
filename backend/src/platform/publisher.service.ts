import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Post } from '../post/Post.entity';
import { PostService } from '../post/post.service';
import { PostPlatform } from '../post/PostPlatform.entity';
import { FacebookService } from './facebook.service';
import Platform from './Platform';
import { TwitterService } from './twitter.service';

@Injectable()
export class PublisherService {
    constructor(
        @Inject(forwardRef(() => PostService))
        private readonly postService: PostService,
        private readonly facebookService: FacebookService,
        private readonly twitterService: TwitterService,
    ) { }

    async publishPost(post: Post): Promise<PostPlatform[]> {
        const postPlatforms = await post.platforms;
        const platformConnections = await Promise.all(postPlatforms.map(postPlatform => postPlatform.platformConnection));

        // this is stopping error, we need to catch and handle
        const updatedPostPlatforms = await Promise.all(platformConnections.map(platformConnection => {
            const postPlatform = postPlatforms.find(x => x.platformConnectionId === platformConnection.id);

            switch (platformConnection.platform) {
                case Platform.FACEBOOK:
                    return this.facebookService.publishPost(post, postPlatform);
                case Platform.TWITTER:
                    return this.twitterService.publishPost(post, postPlatform);
                default:
                    throw new Error("Platform not currently supported");
            }
        }));

        return await this.postService.updatePostPlatforms(updatedPostPlatforms);
    }
}
