import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlatformModule } from '../platform/platform.module';
import { Post } from './Post.entity';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { PostMediaItem } from './PostMediaItem.entity';
import { PostPlatform } from './PostPlatform.entity';
import { PublisherService } from './publisher.service';
import { StatusPollerService } from './status/status-poller.service';
import { PostPlatformStatus } from './status/PostPlatformStatus.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostMediaItem, PostPlatform, PostPlatformStatus]),
    PlatformModule
  ],
  providers: [PostResolver, PostService, PublisherService, StatusPollerService],
  exports: [PostService, StatusPollerService]
})
export class PostModule { }
