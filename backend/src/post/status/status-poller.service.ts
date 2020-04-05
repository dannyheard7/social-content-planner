import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { POST_STATUS_POLLER_QUEUE_NAME } from '../../constants';
import { Post } from '../Post.entity';

@Injectable()
export class PostStatusService {
    constructor(
        @InjectQueue(POST_STATUS_POLLER_QUEUE_NAME) private pollerQueue: Queue,
    ) { }

    async schedulePostStatusPolling(post: Post): Promise<void> {
        // TODO: calculate next polling depending on post age, logarithmic equation
        // IN future we could add extra polling as port of a polling package
        await this.pollerQueue.add(
            {
                postId: post.id,
            }
        );
    }
}
