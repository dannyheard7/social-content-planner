import { Injectable } from '@nestjs/common';
import { FacebookService } from '../platform/facebook.service';
import Platform from '../platform/Platform';
import { TwitterService } from '../platform/twitter.service';
import { Post } from './Post.entity';
import { PostService } from './post.service';
import { PostPlatform } from './PostPlatform.entity';

@Injectable()
export class PublisherService {
    constructor(
        private readonly postService: PostService,
        private readonly facebookService: FacebookService,
        private readonly twitterService: TwitterService,
    ) { }

    async publishPost(post: Post): Promise<PostPlatform[]> {
        const postMedia = await this.postService.getPostImageFiles(post);
        const postPlatforms = await post.platforms;
        const platformConnections = await Promise.all(postPlatforms.map(postPlatform => postPlatform.platformConnection));

        // this is stopping error, we need to catch and handle
        const updatedPostPlatforms = await Promise.all(platformConnections.map(platformConnection => {
            const postPlatform = postPlatforms.find(x => x.platformConnectionId === platformConnection.id);

            switch (platformConnection.platform) {
                case Platform.FACEBOOK:
                    return this.facebookService.publishPost(post.text, postMedia, postPlatform);
                case Platform.TWITTER:
                    return this.twitterService.publishPost(post.text, postMedia, postPlatform);
                default:
                    throw new Error("Platform not currently supported");
            }
        }));

        return await this.postService.savePostPlatforms(updatedPostPlatforms);
    }
}
