import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bull';
import { Repository, FindManyOptions, LessThan } from 'typeorm';
import { POST_STATUS_POLLER_QUEUE_NAME } from '../../constants';
import { Post } from '../Post.entity';
import { PostPlatformStatus } from './PostPlatformStatus.entity';
import { AggregatedStatus } from './AggregatedStatus';
import { StatusDifferential } from './StatusDifferential';


@Injectable()
export class PostStatusService {
    constructor(
        @InjectRepository(PostPlatformStatus)
        private readonly postStatusRepository: Repository<PostPlatformStatus>,
        @InjectQueue(POST_STATUS_POLLER_QUEUE_NAME) private pollerQueue: Queue,
    ) { }

    find = (options?: FindManyOptions<PostPlatformStatus>) => this.postStatusRepository.find(options);

    getLatestAggregatedStatus = async (post: Post) => {
        const result = await this.postStatusRepository
            .createQueryBuilder()
            .select("sum(positive_reactions_count)", "positiveReactionsCount")
            .addSelect("sum(negative_reactions_count)", "negativeReactionsCount")
            .addSelect("sum(comments_count)", "commentsCount")
            .addSelect("sum(shares_count)", "sharesCount")
            .addSelect("timestamp")
            .groupBy("timestamp")
            .orderBy("timestamp", "DESC")
            .where({ postId: post.id })
            .getRawOne();

        if (result)
            return new AggregatedStatus(result.timestamp, result.positiveReactionsCount,
                result.negativeReactionsCount, result.commentsCount, result.sharesCount);
        else return undefined;
    }

    getAggregatedStatuses = async (post: Post) => {
        const results = await this.postStatusRepository
            .createQueryBuilder()
            .select("sum(positive_reactions_count)", "positiveReactionsCount")
            .addSelect("sum(negative_reactions_count)", "negativeReactionsCount")
            .addSelect("sum(comments_count)", "commentsCount")
            .addSelect("sum(shares_count)", "sharesCount")
            .addSelect("timestamp")
            .groupBy("timestamp")
            .orderBy("timestamp", "ASC")
            .where({ postId: post.id })
            .getRawMany();

        return results.map((result) => new AggregatedStatus(result.timestamp, result.positiveReactionsCount,
            result.negativeReactionsCount, result.commentsCount, result.sharesCount));
    }

    getEngagementDifferential = async (post: Post) => {
        const results = await this.postStatusRepository
            .createQueryBuilder("post_platform_status")
            .select("sum(positive_reactions_count)", "positiveReactionsCount")
            .addSelect("sum(negative_reactions_count)", "negativeReactionsCount")
            .addSelect("sum(comments_count)", "commentsCount")
            .addSelect("sum(shares_count)", "sharesCount")
            .addSelect("timestamp")
            .groupBy("timestamp")
            .orderBy("timestamp", "DESC")
            .innerJoin("post_platform_status.post", "post")
            .where("post.userId = :userId", { userId: post.userId })
            .where("post.createdAt <= :createdAt", { createdAt: post.createdAt })
            .orWhere("post.id = :id", { id: post.id })
            .limit(2)
            .getRawMany();

        if (results.length < 2) return null;

        const statuses = results.map((result) =>
            new AggregatedStatus(result.timestamp, result.positiveReactionsCount,
                result.negativeReactionsCount, result.commentsCount, result.sharesCount));

        return statuses[0].getDifferential(statuses[1]);
    }

    private minutesToMilliseconds = (minutes) => minutes * 60 * 1000;

    async schedulePostStatusPolling(post: Post, lastUpdateTime?: Date, current: Date = new Date()) {
        // IN future we could add extra polling as part of a premium package
        const delay = lastUpdateTime ? (current.getTime() - lastUpdateTime.getTime()) * 1.75 : this.minutesToMilliseconds(5);

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