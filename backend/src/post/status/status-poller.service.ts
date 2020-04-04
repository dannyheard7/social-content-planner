import { Injectable } from '@nestjs/common';
import { FacebookService } from '../../platform/facebook.service';
import { TwitterService } from '../../platform/twitter.service';
import { Post } from '../Post.entity';
import Platform from '../../platform/Platform';
import { SchedulerRegistry } from '@nestjs/schedule';
import { PostPlatformStatus } from './PostPlatformStatus.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StatusPollerService {
    constructor(
        private schedulerRegistry: SchedulerRegistry,
        @InjectRepository(PostPlatformStatus)
        private readonly postStatusRepository: Repository<PostPlatformStatus>,
        private readonly facebookService: FacebookService,
        private readonly twitterService: TwitterService,
    ) { }


    async pollPostStatus(post: Post): Promise<PostPlatformStatus[]> {
        const postPlatforms = await post.platforms;
        const platformConnections = await Promise.all(postPlatforms.map(postPlatform => postPlatform.platformConnection));

        // this is stopping error, we need to catch and handle
        return await Promise.all(platformConnections.map(platformConnection => {
            const postPlatform = postPlatforms.find(x => x.platformConnectionId === platformConnection.id);

            switch (platformConnection.platform) {
                case Platform.FACEBOOK:
                    return this.facebookService.getPostStatus(postPlatform)
                default:
                    throw new Error("Platform not currently supported");
            }
        }));
    }

    private async updatePostStatus(post: Post): Promise<void> {
        const statuses = await this.pollPostStatus(post);
        await this.postStatusRepository.save(statuses);
    }

    async schedulePostStatusPolling(post: Post): Promise<void> {
        // TODO: calculate next polling depending on post age, logarithmic equation
        // IN future we could add extra polling as port of a polling package

        // let's start with once per hour
        const interval = setInterval(async () => {
            this.updatePostStatus(post)
            this.schedulePostStatusPolling(post);
        }, 60 * 60);
        this.schedulerRegistry.addInterval(`${post.id} status poller`, interval);
    }
}
