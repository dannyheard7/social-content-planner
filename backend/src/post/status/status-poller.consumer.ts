import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { POST_STATUS_POLLER_QUEUE_NAME } from '../../constants';
import { FacebookService } from '../../platform/facebook.service';
import Platform from '../../platform/Platform';
import { TwitterService } from '../../platform/twitter.service';
import { PostService } from '../post.service';
import { PostStatusService } from './post-status.service';

@Processor(POST_STATUS_POLLER_QUEUE_NAME)
export class StatusPollerConsumer {
    constructor(
        private readonly postService: PostService,
        private readonly postStatusService: PostStatusService,
        private readonly facebookService: FacebookService,
        private readonly twitterService: TwitterService
    ) { }

    @Process()
    async pollStatus(job: Job<{ postId: string }>) {
        const post = await this.postService.findById(job.data.postId);

        const postPlatforms = await post.platforms;
        const platformConnections = await Promise.all(postPlatforms.map(postPlatform => postPlatform.platformConnection));

        // TODO: this is stopping on error, we need to catch and handle
        const statuses = await Promise.all(platformConnections.map(platformConnection => {
            const postPlatform = postPlatforms.find(x => x.platformConnectionId === platformConnection.id);

            switch (platformConnection.platform) {
                case Platform.FACEBOOK:
                    return this.facebookService.getPostStatus(postPlatform);
                case Platform.TWITTER:
                    return this.twitterService.getPostStatus(postPlatform);
                default:
                    throw new Error("Platform not currently supported");
            }
        }));

        const latestUpdate = await this.postStatusService.getLatestPostStatusTimestamp(post);

        await Promise.all([
            this.postStatusService.saveStatuses(statuses),
            this.postStatusService.schedulePostStatusPolling(post, latestUpdate ?? post.createdAt)
        ]);
    }
}