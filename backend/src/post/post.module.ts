import { Module } from '@nestjs/common';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostImage } from './PostImage.entity';
import { Post } from './Post.entity';
import { PostPlatform } from './PostPlatform.entity';
import { PlatformModule } from '../platform/platform.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostPlatform, PostImage]),
    PlatformModule,
  ],
  providers: [PostResolver, PostService],
})
export class PostModule {}
