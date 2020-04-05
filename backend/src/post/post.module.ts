import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformModule } from '../platform/platform.module';
import { Post } from './Post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { PostMediaItem } from './PostMediaItem.entity';
import { PostPlatform } from './PostPlatform.entity';
import { PublisherService } from './publisher.service';
import { PostPlatformStatus } from './status/PostPlatformStatus.entity';
import { PostStatusService } from './status/status-poller.service';
import { POST_STATUS_POLLER_QUEUE_NAME } from '../constants';
import { StatusPollerConsumer } from './status/status-poller.consumer';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostMediaItem, PostPlatform, PostPlatformStatus]),
    PlatformModule,
    BullModule.registerQueueAsync({
      useFactory: (configService: ConfigService) => ({
        name: POST_STATUS_POLLER_QUEUE_NAME,
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: parseInt(configService.get<string>('REDIS_PORT')),
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
  providers: [PostResolver, PostService, PublisherService, PostStatusService, StatusPollerConsumer],
  exports: [PostService, PostStatusService]
})
export class PostModule { }
