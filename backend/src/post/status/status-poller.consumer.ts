import { Process, Processor } from '@nestjs/bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { Repository } from 'typeorm';
import { POST_STATUS_POLLER_QUEUE_NAME } from '../../constants';
import { FacebookService } from '../../platform/facebook.service';
import Platform from '../../platform/Platform';
import { TwitterService } from '../../platform/twitter.service';
import { PostPlatformStatus } from './PostPlatformStatus.entity';
import { Post } from '../Post.entity';
import { PostStatusService } from './status-poller.service';
import { PostService } from '../post.service';

@Processor(POST_STATUS_POLLER_QUEUE_NAME)
export class StatusPollerConsumer {
    constructor(
        @InjectRepository(PostPlatformStatus)
        private readonly postStatusRepository: Repository<PostPlatformStatus>,
        private readonly postService: PostService,
        private readonly statusPollerService: PostStatusService,
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
                    return this.facebookService.getPostStatus(postPlatform)
                default:
                    throw new Error("Platform not currently supported");
            }
        }));

        await Promise.all([
            this.postStatusRepository.save(statuses),
            this.statusPollerService.schedulePostStatusPolling(post)
        ]);
    }
}