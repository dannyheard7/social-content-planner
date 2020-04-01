import { Module, forwardRef } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostMediaItem } from './PostMediaItem.entity';
import { Post } from './Post.entity';
import { PostPlatform } from './PostPlatform.entity';
import { PlatformModule } from '../platform/platform.module';
import { PublisherService } from './publisher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostPlatform, PostMediaItem]),
    PlatformModule,
  ],
  providers: [PostResolver, PostService, PublisherService],
  exports: [PostService]
})
export class PostModule { }
