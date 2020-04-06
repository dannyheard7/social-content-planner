import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Repository, FindManyOptions } from 'typeorm';
import { POST_STATUS_POLLER_QUEUE_NAME } from '../../constants';
import { Post } from '../Post.entity';
import { PostPlatformStatus } from './PostPlatformStatus.entity';
import { AggregatedStatus } from './AggregatedStatus';


@Injectable()
export class PostStatusService {
    constructor(
        @InjectRepository(PostPlatformStatus)
        private readonly postStatusRepository: Repository<PostPlatformStatus>,
        @InjectQueue(POST_STATUS_POLLER_QUEUE_NAME) private pollerQueue: Queue,
    ) { }

    find = (options?: FindManyOptions<PostPlatformStatus>) => this.postStatusRepository.find(options);

    getAggregatedStatuses = async (postId: string) => {
        const results = await this.postStatusRepository
            .createQueryBuilder()
            .select(["sum(positive_reactions_count)", "sum(negative_reactions_count)", "sum(comments_count)", "sum(shares_count)", "timestamp"])
            .groupBy("timestamp")
            .where({ postId })
            .getRawMany();

        return results.map((result) => new AggregatedStatus(result.timestamp, result.positiveReactionsCount,
            result.negativeReactionsCount, result.commentsCount, result.sharesCount));
    }

    private minutesToMilliseconds = (minutes) => minutes * 60 * 1000;

    async schedulePostStatusPolling(post: Post, lastUpdateTime?: Date, current: Date = new Date()) {
        // IN future we could add extra polling as part of a premium package
        const delay = lastUpdateTime ? (current.getTime() - lastUpdateTime.getTime()) * 2 : this.minutesToMilliseconds(5);

        await this.pollerQueue.add(
            {
                postId: post.id,
            },
            {
                delay
            }
        );
    }

    saveStatuses = (statuses: PostPlatformStatus[]) => this.postStatusRepository.save(statuses);

    async getLatestPostStatusTimestamp(post: Post): Promise<Date | undefined> {
        this.postStatusRepository.findOne

        const status = await this.postStatusRepository.findOne({
            select: ["timestamp"],
            where: { postId: post.id },
            order: {
                timestamp: "DESC"
            }
        });

        return status?.timestamp;
    }
}
