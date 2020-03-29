import { Injectable } from '@nestjs/common';
import { Post } from '../post/Post.entity';
import { FacebookService } from './facebook.service';
import Platform from './Platform';
import { TwitterService } from './twitter.service';

@Injectable()
export class PublisherService {
    constructor(
        private readonly facebookService: FacebookService,
        private readonly twitterService: TwitterService
    ) { }

    async publishPost(post: Post): Promise<boolean> {
        const postPlatforms = await post.platforms;
        const platformConnections = await Promise.all(postPlatforms.map(postPlatform => postPlatform.platformConnection));

        // this is stopping error, we need to catch and handle
        // TODO: get all post ids and relevant info and insert them into the db for future uses
        await Promise.all(platformConnections.map(platformConnection => {
            switch (platformConnection.platform) {
                case Platform.FACEBOOK:
                    return this.facebookService.publishPost(post, platformConnection);
                case Platform.TWITTER:
                    return this.twitterService.publishPost(post, platformConnection);
                default:
                    throw new Error("Platform not currently supported");
            }
        }));

        return true;
    }
}
